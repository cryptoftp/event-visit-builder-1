const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

function buildReport(services, guideChecked, audioChecked, catalogChecked) {
  const chosen = { guide: guideChecked, audio: audioChecked, catalog: catalogChecked };
  const items = services
    .filter(service => chosen[service.id])
    .map(service => {
      const { title, price } = service;
      return { title: title.trim(), price };
    });

  return {
    count: items.length,
    total: items.reduce((sum, item) => sum + item.price, 0),
    items
  };
}

const form = document.querySelector('#service-form');
const program = document.querySelector('#program');
const choiceError = document.querySelector('#choice-error');
const dataError = document.querySelector('#data-error');
const result = document.querySelector('#result');
const reportJson = document.querySelector('#report-json');

let data;
try {
  data = JSON.parse(sourceJson);
} catch (error) {
  dataError.innerHTML = 'Ошибка данных.';
  dataError.hidden = false;
  form.hidden = true;
}

if (data) {
  form.hidden = false;

  document.querySelector('#show-program').addEventListener('click', () => {
    program.innerHTML = data.event.meeting;
    program.hidden = false;
  });

  form.addEventListener('submit', event => {
    event.preventDefault();

    const guideChecked = document.querySelector('#guide').checked;
    const audioChecked = document.querySelector('#audio').checked;
    const catalogChecked = document.querySelector('#catalog').checked;
    const report = buildReport(data.services, guideChecked, audioChecked, catalogChecked);

    if (report.count === 0) {
      choiceError.innerHTML = 'Выберите хотя бы одну услугу.';
      choiceError.hidden = false;
      result.hidden = true;
      reportJson.hidden = true;
      return;
    }

    choiceError.hidden = true;
    result.innerHTML = `Выбрано услуг: ${report.count}<br>Итого: ${report.total} руб.` +
      report.items.map(item => `<br>${item.title}`).join('');

    const jsonString = JSON.stringify(report);
    JSON.parse(jsonString);
    reportJson.textContent = jsonString;
    result.hidden = false;
    reportJson.hidden = false;
  });
}
