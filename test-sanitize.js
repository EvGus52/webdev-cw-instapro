// Тест функции sanitize
const sanitize = (value) => {
  return value.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
};

// Тестовые случаи
console.log("Тест 1:", sanitize('<script>alert("test")</script>'));
console.log("Тест 2:", sanitize("Обычный текст"));
console.log("Тест 3:", sanitize("<div>Текст в теге</div>"));
console.log("Тест 4:", sanitize(""));
console.log("Тест 5:", sanitize("<"));
console.log("Тест 6:", sanitize(">"));
