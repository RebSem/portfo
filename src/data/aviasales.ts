/**
 * Copy for /ru/aviasales/, the one-off landing resume for the Aviasales
 * "Product Manager (Hotels)" vacancy. Career facts and numbers come from cv.ts
 * through cvMetric, so a renamed metric fails the build. Travel facts were given
 * by the owner on 16 Nov 2026. Jokes that refer to current memes sit in avMemes
 * and only the owner flips `approved`. No dashes in any string, no phone, no
 * absolute money about salary or revenue.
 */
import { memeIsLive, type AvMeme } from '../lib/aviasales';
import { cvMetric, cvName } from './cv';

const customers = cvMetric('customers').value.ru; // 80
const minutes = cvMetric('minutes').value.ru; // 500 000+
const share = cvMetric('group-share').value.ru; // ~10%
const spend = cvMetric('average-spend').value.ru; // +30%
const repeat = cvMetric('repeat-revenue').value.ru; // 30%
// "130+ стран: CPaaS-продукты группы, массовые звонки и SMS": the cv.ts wording, verbatim.
const countries = `${cvMetric('countries').value.ru} ${cvMetric('countries').label.ru}`;

export const avVacancy = {
  title: 'Product Manager (Hotels)',
  url: 'https://www.aviasales.ru/about/vacancies/4365963',
  flight: 'PM 4365963',
} as const;

/* ---------- memes: every line was approved by the owner on 15 and 16 Nov 2026 ---------- */

export const avMemes: AvMeme[] = [
  { id: 'hermes', text: 'Эрмесовку пусть берут другие. Я пришёл брать выдачу отелей.', approved: true, showUntil: '2026-12-15' },
  { id: 'paris', text: 'На связи до 17:00 по Парижу. Это 21:00 по Перми и 23:00 по Пхукету.', approved: true, showUntil: '2026-12-15' },
  { id: 'baroness', text: 'Баронесса взяла Эрмесовку. Продакт берёт Hotels. Каждый штурмует своё.', approved: true, showUntil: '2026-12-15' },
  { id: 'jacket', text: 'Кожаной куртки нет. Секретов от команды тоже.', approved: true, showUntil: '2026-12-15' },
  { id: 'dog', text: 'Вот такие дела, собачка.', approved: true, showUntil: '2026-12-31' },
  { id: 'gta-before', text: 'Успел откликнуться до выхода GTA 6', approved: true },
  { id: 'gta-after', text: 'GTA 6 вышла. Я всё равно здесь.', approved: true },
  { id: 'mission', text: 'Миссия выполнена: резюме дочитано.', approved: true },
];

/** Text of a live meme, or null. Components render nothing for null. */
export const meme = (id: string, now: Date = new Date()): string | null => {
  const found = avMemes.find((item) => item.id === id);
  return found && memeIsLive(found, now) ? found.text : null;
};

/* ---------- blue band ---------- */

export const avHero = {
  h1: 'Здесь бронируют балдёжного продакта',
  h1Plain: `${cvName.ru}, Product Manager`,
  lead: `${cvName.ru}, Product Manager. За год запустил направление с нуля до ${customers} платящих B2B-клиентов. Это отклик на вакансию Product Manager (Hotels), собранный как ваша отельная выдача.`,
  tabs: [
    { label: 'Резюме', href: '/ru/cv/', nofollow: true, current: false },
    { label: 'Отели', href: '#av-results', nofollow: false, current: true },
    { label: 'Наблюдения', href: '#av-notes-title', nofollow: false, current: false },
    { label: 'Кейсы', href: '/ru/#projects', nofollow: false, current: false },
  ],
  searchAria: 'Шуточная форма поиска. Куда: Авиасейлс, Hotels. Заезд: как позовёте. Выезд: не спешу. Гости: один продакт.',
  search: [
    { label: 'Куда', value: 'Авиасейлс, Hotels' },
    { label: 'Заезд', value: 'как позовёте' },
    { label: 'Выезд', value: 'не спешу' },
    { label: 'Гости', value: '1 продакт' },
  ],
  searchButton: 'Найти продакта',
  loader: [
    'Ищем продакта в разных уголках вселенной...',
    'Проверяем роадмап на мягонькость...',
    'Инспектируем уютность бэклога...',
  ],
  board: ['ПЕРМЬ → HOTELS', 'РЕЙС PM 4365963', 'ПОСАДКА ОТКРЫТА'],
  calm: { off: 'Авиарежим', on: 'Авиарежим включён', title: 'Выключить шутки и анимации' },
} as const;

/* ---------- results: sort, filters, proofs ---------- */

export const avResults = {
  count: '1 продакт для Авиасейлс',
  countPlain: 'Кратко',
  filtersTitle: 'Чего ждём от тебя',
  filtersHint: 'Семь строк из вашей вакансии. Нажмите на любую.',
  proofsTitle: 'Почему подходит',
} as const;

export const avSort = [
  { id: 'fit', label: 'Сначала подходящие', reply: '' },
  { id: 'cheap', label: 'Цены по возрастанию', reply: 'Цена одна: по договорённости.' },
  { id: 'dear', label: 'Цены по убыванию', reply: 'Цена одна: по договорённости.' },
  { id: 'rating', label: 'Рейтинг от высокого к низкому', reply: 'Оценок пока нет. Будете первыми.' },
] as const;

export interface AvRequirement {
  id: 'r1' | 'r2' | 'r3' | 'r4' | 'r5' | 'r6' | 'r7';
  /** Short label for the filter row. */
  short: string;
  /** The vacancy line, verbatim. */
  quote: string;
  proof: string;
  link?: { label: string; href: string };
}

export const avRequirements: AvRequirement[] = [
  {
    id: 'r1',
    short: 'Сложный продукт с большой аудиторией',
    quote: 'опыт работы продактом в сложном продукте с большой аудиторией',
    proof: `4,5 года в B2B SaaS. Вёл платформу автоматизации звонков целиком: личный кабинет, кампании, конструктор сценариев, телефония, посекундный биллинг, кошельки, отчётность. ${countries}. В новом направлении меньше чем за год набралось ${minutes} минут живых разговоров. Аудитория была B2B. Масштаб B2C для меня новый, к нему и иду.`,
  },
  {
    id: 'r2',
    short: 'Довести задачу до запуска',
    quote: 'умение самостоятельно проработать задачу, разбить её на шаги и довести до запуска',
    proof: `Zvonobot AI, направление голосовых AI-агентов: с нуля до рынка за несколько недель. Сначала запустил на white-label платформе и доказал спрос на живых клиентах, потом обосновал цифрами переход на собственную. Итог меньше чем за год: ${customers} платящих B2B-клиентов и ${share} выручки группы.`,
    link: { label: 'Кейс Zvonobot AI', href: '/ru/projects/zvonobot-ai-ru/' },
  },
  {
    id: 'r3',
    short: 'Проекты с зависимостями и партнёрами',
    quote: 'опыт ведения проектов с несколькими участниками и зависимостями, взаимодействия со смежными командами и внешними партнёрами',
    proof: 'Запуск шёл через продажи, поддержку и финансы: вёл go-to-market, каждую неделю обучал продажи и поддержку продукту, отдел продаж вырос с 4 до 15 менеджеров под направление. Снаружи были провайдеры: маршрутизация трафика, биллинг, интеграции по API.',
  },
  {
    id: 'r4',
    short: 'Метрики и данные',
    quote: 'понимание продуктовых метрик и умение работать с данными',
    proof: `Отвечал за прайсинг, тарифы, маржу по типам звонков и юнит-экономику направления. ${spend} к среднему чеку у клиентов, которые перешли с классического линейного IVR-робота на AI-агентов, в среднем со старта продаж; часть роста дала цена: агенты дороже робота. Повторные оплаты давали ${repeat} выручки направления. Гипотезы проверял на метриках и A/B-тестах сценариев.`,
  },
  {
    id: 'r5',
    short: 'Незнакомые системы и интеграции',
    quote: 'готовность разбираться в незнакомых системах, интеграциях и технических ограничениях, собирать разрозненную информацию в понятное решение',
    proof: 'Начинал разработчиком, поэтому говорю с инженерами на одном языке. Продуктовый контур направления был на мне целиком: конструктор AI-агентов, LLM-аналитика звонков, тарифы с посекундным биллингом по компонентам стоимости (LLM, ASR, TTS), холд баланса на старте кампании. MVP голосового бота на OpenAI Realtime API собрал за 2 дня, внутренний аналитический инструмент поверх базы данных за 4 дня.',
  },
  {
    id: 'r6',
    short: 'Чёрный пояс по коммуникации',
    quote: 'черный пояс по коммуникации',
    proof: 'Команда из 4 инженеров подчинялась техлиду, а приоритеты, постановка и приёмка были за мной. Ставил квартальные цели по направлению и защищал их перед руководством. Продажи и поддержку учил продукту каждую неделю.',
  },
  {
    id: 'r7',
    short: 'Любовь к путешествиям',
    quote: 'большая любовь к путешествиям и желание делать путешественникам хорошо',
    proof: 'Летаю 6-8 раз в год. За последний год Дубай и Алматы, до этого Армения и Грузия. В Авиасейлс смотрю, куда и чем лететь. Жильё пока выбираю на Airbnb. Хочу, чтобы и его я выбирал у вас.',
  },
];

/* ---------- candidate card ---------- */

export const avCard = {
  name: cvName.ru,
  type: 'Product Manager · 4,5 года в продукте',
  direct: 'Напрямую у продакта',
  facts: ['Пермь, GMT+5', 'Удалённо', 'Готов выйти сразу', 'Бесплатная отмена до конца испытательного'],
  summary: `Запустил направление голосовых AI-агентов с нуля до ${customers} платящих B2B-клиентов и ${share} выручки группы меньше чем за год. Начинал разработчиком, поэтому говорю с инженерами на одном языке.`,
  metrics: ['customers', 'minutes', 'group-share'],
  priceLabel: 'Цена',
  price: 'по договорённости',
  cta: 'Забронировать продакта',
  ctaPdf: 'Скачать PDF',
  ctaCv: 'Резюме без самолётиков',
  slides: [
    { kind: 'plate', title: 'PM', sub: 'Hotels' },
    { kind: 'shot', src: '/projects/zvonobot-agent-light.webp', alt: 'Zvonobot AI: конструктор голосового агента' },
    { kind: 'shot', src: '/projects/obrabot-prompts-light.webp', alt: 'Obrabot: реестр промптов' },
  ],
} as const;

export const avDirect = {
  title: 'Бронирование напрямую у продакта',
  intro: 'Пишите сразу мне, без посредников:',
  points: [
    'так проще сравнивать: я один, проверять каждый вариант отдельно не нужно;',
    'без наценок: агентств между нами нет;',
    'вопросы решаются быстрее: вы общаетесь с продактом напрямую.',
  ],
  cta: 'Написать напрямую',
  close: 'Закрыть',
} as const;

/* ---------- ticket ribbon ---------- */

export const avTickets = [
  { kind: 'fast', badge: 'Самый быстрый', from: 'Оффер', to: 'Первый день', note: 'готов выйти сразу, без отработки', old: '14 дн.', price: '0 дн.', drop: { from: 14, to: 0, suffix: ' дн.' } },
  { kind: 'cheap', badge: 'Самый дешёвый', from: 'Резюме', to: 'Разговор', note: 'одно сообщение в Telegram', old: '14 990 ₽', price: '0 ₽', drop: { from: 14990, to: 0, suffix: ' ₽' } },
  { kind: 'best', badge: 'Оптимальный', from: 'Идея', to: 'Прод', note: 'в багаже 4,5 года опыта', old: '', price: 'без пересадок', drop: null },
] as const;

/* ---------- details ---------- */

export const avDetails = {
  title: 'Про продакта',
  titlePlain: 'Опыт',
  about: 'Описание',
  stays: 'История бронирований',
  staysPlain: 'Опыт работы',
  amenities: 'Удобства',
  amenitiesPlain: 'Навыки',
} as const;

/** Which cv.ts bullets each "stay" shows: indexes into cvExperience[role].phases[phase].bullets. */
export const avStays = [
  { role: 0, phase: 0, bullets: [0, 1, 3] }, // Zvonobot AI launch
  { role: 0, phase: 1, bullets: [0, 1, 3] }, // calls platform
  { role: 1, phase: 0, bullets: [0] }, // Fodoj
] as const;

/** The sixth amenity is the approved `jacket` meme: the component adds it when the meme is live. */
export const avAmenities = [
  { icon: 'chart', text: 'Метрики и юнит-экономика в номере' },
  { icon: 'plug', text: 'Интеграции и API' },
  { icon: 'route', text: 'Трансфер от идеи до прода' },
  { icon: 'chat', text: 'Говорит с инженерами без переводчика' },
  { icon: 'paw', text: 'Можно с животными: мопс пиксельный' },
] as const;

/** Display labels for the baggage belt, shortened from cvSkillGroups. The handbag is the easter egg. */
export const avBaggage = [
  'метрики и продуктовая аналитика',
  'A/B-эксперименты',
  'юнит-экономика',
  'прайсинг и монетизация',
  'discovery, кастдев',
  'PRD и ТЗ',
  'SQL',
  'PostHog',
  'интеграции',
  'go-to-market',
] as const;

/* ---------- notes on their hotel search ---------- */

export const avNotes = {
  title: 'Что бы я проверил в вашей выдаче отелей',
  intro: 'Прошёл вашу выдачу 16 ноября как обычный гость: Сочи и Дубай, 12-14 декабря, двое взрослых, с компьютера. Ваших данных у меня нет, поэтому это вопросы снаружи, а не рецепты. Возможно, половину вы уже проверили.',
  labels: { seen: 'Что увидел', idea: 'О чём подумал', metric: 'На что бы смотрел', test: 'Как бы проверил' },
  items: [
    {
      title: 'Цена: за ночь или за всё?',
      seen: 'В карточке крупно стоит сумма за весь срок, мелко цена за ночь. Фильтр называется «Цена за ночь». Пины на карте показывают сумму за срок. Бюджет приходится пересчитывать в уме.',
      idea: 'Интересно, пробовали ли вы одну единицу на весь экран с переключателем «за ночь / за всё». На Airbnb, где я пока бронирую жильё, цена одна: итог за поездку, разбивка по нажатию.',
      metric: 'Доля сессий, где фильтр цены трогали два раза и больше. Переходы из выдачи в карточку отеля после фильтра цены.',
      test: 'A/B: единая единица цены против текущего вида.',
    },
    {
      title: 'Почему самые дешёвые оказались самыми далёкими?',
      seen: 'В Сочи сортировка «Цены по возрастанию» подняла наверх объекты в 18-19 км от центра. У первых двух вместо фото был серый блок.',
      idea: 'Интересно, учитывает ли сортировка по цене качество карточки: есть ли фото, далеко ли до центра. Или можно честно подписать: «дешевле всех, но 19 км до центра».',
      metric: 'Клики по первым пяти позициям при сортировке по цене. Доля тех, кто после неё возвращается к «Сначала популярные».',
      test: 'A/B на порядок внутри сортировки по цене.',
    },
    {
      title: 'Что делать на пустой выдаче?',
      seen: 'Собрал фильтры так, чтобы ничего не нашлось. Кнопка «Показать все отели» оставила экран пустым. «Искать без фильтров» сбросила заодно и сортировку.',
      idea: 'Интересно, пробовали ли вы показывать, какой именно фильтр обнулил выдачу, и предлагать снять его одним нажатием с числом вариантов, которое останется.',
      metric: 'Доля сессий, которые продолжили поиск после нуля. Уходы с пустой выдачи.',
      test: 'A/B на экран пустой выдачи.',
    },
  ],
  moreTitle: 'Ещё заметил',
  more: [
    'У пунктов фильтров нет счётчиков: не видно, сколько вариантов останется.',
    'Оценка 4,8 по одному отзыву стоит в списке рядом с 4,6 по ста восьмидесяти.',
    'Строка «Дешевле на N ₽» в карточке не говорит, дешевле чем где. Ответ есть на странице отеля.',
    'В Дубае на первой странице «Остался 1 номер по этой цене» стояло у 18 карточек из 20.',
  ],
  outro: 'Что из этого вы уже проверяли? Хотел бы сравнить.',
} as const;

/* ---------- turbulence ---------- */

export const avTurb = {
  title: 'Турбулентность',
  titlePlain: 'О путешествиях',
  belt: 'ПРИСТЕГНИТЕ РЕМНИ',
  lead: 'Немного аэрофоб. Летаю 6-8 раз в год и справляюсь.',
  phases: [
    { name: 'Регистрация', level: 10, say: 'спокоен' },
    { name: 'Взлёт', level: 45, say: 'держусь' },
    { name: 'Турбулентность', level: 60, say: 'считаю до десяти' },
    { name: 'Посадка', level: 25, say: 'почти турист' },
    { name: 'Отель', level: 5, say: 'отпустило' },
  ],
  punch: 'Побаиваюсь летать, а иду в Авиасейлс.',
  serious: 'Зато на земле я придирчивый гость: где жить, сколько это стоит на самом деле и далеко ли до всего. Хочу, чтобы отель в Авиасейлс выбирался так же легко, как билет.',
  trips: ['Дубай', 'Алматы', 'Армения', 'Грузия'],
} as const;

/* ---------- booking ---------- */

export const avBooking = {
  title: 'Бронирование',
  titlePlain: 'Контакты',
  rows: [
    { k: 'Даты', v: 'готов выйти сразу' },
    { k: 'Гости', v: '1 продакт' },
    { k: 'Питание', v: 'кофе включён' },
    { k: 'Оплата', v: 'как у вас принято' },
  ],
  cta: 'Забронировать продакта',
  place: 'Пермь, GMT+5. Удалённо.',
  passNote: 'Сохраните талон до оффера',
} as const;

export const avFooter = {
  legal: 'Неофициальная страница кандидата. Авиасейлс к ней отношения не имеет. Название вакансии и строки из неё взяты с aviasales.ru.',
  made: 'Мопс пиксельный, обязанности декоративные.',
} as const;

/* ---------- toasts ---------- */

export const avToasts = {
  price: {
    title: 'Цена на продакта снизилась',
    text: 'Пермь → Hotels. Продакт подешевел на 0 ₽. Осталось мест: 1.',
    cta: 'Отправить оффер',
  },
  mission: {
    title: 'Миссия выполнена',
    text: 'Резюме дочитано.',
    cta: 'Новая миссия: написать продакту',
    later: 'Не сейчас',
  },
} as const;
