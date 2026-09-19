const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

// Load the actual popup filters without wiring browser events or sending messages.
const source = fs.readFileSync(path.join(__dirname, '../popup.js'), 'utf8')
  .split('// ------------------ СОБЫТИЯ ------------------')[0];
const context = vm.createContext({ document: { getElementById: () => ({}) }, URL });
vm.runInContext(source, context);
const analyze = text => context.analyzePost(text, new Date().toISOString(), { requireRemote: true, minScore: 0 });
const chatJob = `💼 **Специалист по
поддержке в чате**
🏢 Компания: не указана
🏠 Формат: удалённо
📅 График: гибкий, смены от 4 ч.
💰 Зарплата: 99 000 – 103 000 ₽
🧑 Опыт: без опыта
📝 **Описание вакансии**
Обязанности:
• Отвечать клиентам в чате, используя наши готовые ответы.
• Если вопрос сложный, передавать его старшему коллеге.
• Кратко записывать, чем закончился разговор.
Требования:
• Уметь писать без ошибок на русском языке.
• Быть доброжелательным и внимательным.
• Уверенно пользоваться компьютером и иметь хороший интернет.
• Опыт не нужен — мы научим всему необходимому.
Условия:
• Гибкий график: смены от 4 часов, отлично подходит для совмещения.
• Только чат: никаких холодных звонков и активных продаж.
• Полное обучение и помощь личного наставника.
• Честная оплата: ставка за час плюс понятные премии.
• Быстрый прием на работу, резюме не обязательно!
Контакт: @recruiter`;
const tradingJob = `Требуется РОП топ-уровня в онлайн-школу (2000+ выпускников)
Trading Volium – помогаем трейдерам выйти на стабильный доход. За 12 мес больше 150 учеников с результатом
Требования: Нужен человек, который реально делал результат в инфобизе на должность лидера отдела продаж
Условия: Зарплата - обсуждается индивидуально. Удаленная работа
Контакты: @recruiter К отклику приложите резюме`;

test('reported chat job is rejected even at minimum priority threshold', () => {
  const result = analyze(chatJob);
  assert.equal(result.accepted, false);
  assert.equal(result.uncertain, false);
  assert.equal(context.classifyRejectCode(result.reject), 'suspicious_simple_job');
  assert.equal(context.reviewPriorityFor({ text: chatJob }, result).level, 'medium');
});
test('reported trading school has an explicit exclusion reason', () => {
  const result = analyze(tradingJob);
  assert.equal(result.accepted, false);
  assert.equal(context.classifyRejectCode(result.reject), 'excluded_trading');
});
for (const word of ['трейдинг', 'трединг', 'трейдинговая', 'трейдеров', 'TRADING', 'traiding', 'Trading', 'tra\u200biding', 'ＴＲＡＤＩＮＧ']) {
  test(`excludes ${word} regardless of job score or format`, () => {
    const result = analyze(chatJob.replace('99 000 – 103 000', '50 000') + '\n' + word);
    assert.equal(context.classifyRejectCode(result.reject), 'excluded_trading');
  });
}
for (const salary of ['99\u00a0000 – 103\u00a0000 ₽', '99k – 103k RUB', '99к – 103к руб.', '99000 руб', '90 000 ₽']) {
  test(`detects high salary: ${salary}`, () => {
    assert.ok(context.suspiciousSimpleJob(chatJob.replace('99 000 – 103 000 ₽', salary)));
  });
}
for (const salary of ['50 000 ₽', '30 000 – 100 000 ₽', '30k – 100k RUB', 'по договорённости', '99 000 ₽ в год', '99 000 USD']) {
  test(`does not flag salary alone: ${salary}`, () => {
    assert.equal(context.suspiciousSimpleJob(chatJob.replace('99 000 – 103 000 ₽', salary)), null);
  });
}
test('normal chat support remains accepted', () => {
  assert.equal(analyze(chatJob.replace('99 000 – 103 000', '50 000')).accepted, true);
});
test('short technical duties with high pay are not classified as simple work', () => {
  const technical = chatJob.replace(/Обязанности:[\s\S]*?Требования:/, 'Обязанности:\n• Разрабатывать интерфейсы на React.\n• Писать SQL-запросы и оптимизировать API.\nТребования:');
  assert.equal(context.suspiciousSimpleJob(technical), null);
  assert.equal(analyze(technical).accepted, true);
});
test('experience requirement prevents the beginner heuristic', () => {
  const experienced = chatJob.replace('без опыта', 'от 3 лет').replace('Опыт не нужен — мы научим всему необходимому.', 'Обязателен опыт от 3 лет.');
  assert.equal(context.suspiciousSimpleJob(experienced), null);
});
test('unrelated substrings are not trading mentions', () => {
  assert.equal(context.hasTradingMention('Настройка threading и multitradingwidget'), false);
});
test('escaped markdown does not bypass the risk filter', () => {
  assert.ok(context.suspiciousSimpleJob(chatJob.replaceAll('**', '\\*\\*')));
});
for (const salary of ['99–103 тыс. ₽', '99–103k RUB']) {
  test(`shared thousands unit: ${salary}`, () => {
    assert.ok(context.suspiciousSimpleJob(chatJob.replace('99 000 – 103 000 ₽', salary)));
  });
}
test('shared thousands unit preserves a low range floor', () => {
  assert.equal(context.suspiciousSimpleJob(chatJob.replace('99 000 – 103 000 ₽', '30–100k RUB')), null);
});
test('wrapped bullet points and headings without colons are supported', () => {
  assert.ok(context.suspiciousSimpleJob(chatJob.replace('Обязанности:', 'Обязанности').replace('Требования:', 'Требования').replace('наши готовые', 'наши\nготовые')));
});
test('long duty list does not match the short-list rule', () => {
  assert.equal(context.suspiciousSimpleJob(chatJob.replace('Требования:', '• Настраивать интеграции CRM.\nТребования:')), null);
});
