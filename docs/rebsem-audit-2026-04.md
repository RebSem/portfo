# Глубокий аудит позиционирования `rebsem.ru`

Дата: 8 апреля 2026

## Как читать этот документ

Этот текст написан не как список багов и не как “дизайн-аудит сайта”, а как стратегический разбор того, как сайт считывается извне и почему в текущем виде он пока недопродает твою самую дорогую ценность.

Это документ про:

- рыночное восприятие;
- narrative gaps;
- доверие;
- архитектуру доказательств;
- сравнение с сильными персональными сайтами;
- то, как превратить сайт из “аккуратного портфолио” в инструмент конверсии для дорогих, умных и осторожных людей.

Технические недочеты тоже важны, но здесь они стоят ниже по значимости, чем вопрос: “что человек о тебе думает после 10 секунд, 60 секунд и 5 минут на сайте?”

## 1. Самый короткий вывод

Сейчас сайт говорит:

> “Я умный, широкий, аккуратный, технически сильный и интересный generalist.”

Но сайту нужно говорить:

> “Я редкий тип operator-builder’а: умею взять неясную продуктовую задачу, собрать из нее правильную структуру, встроить AI там, где он реально полезен, и довести все до рабочего состояния без лишней прослойки между идеей и запуском.”

Главная проблема не в том, что сайт “слабый”. Главная проблема в том, что он пока лучше показывает диапазон, чем ценность. Он продает breadth, но недостаточно продает relevance.

В глазах умного клиента breadth без правильной рамки легко превращается в ambiguity:

- “Он product manager?”
- “Он full-stack разработчик?”
- “Он AI-консультант?”
- “Он просто любопытный человек, который делает много разного?”

Пока сайт не отвечает на это достаточно жестко, пользователю приходится самому собирать твою ценность из фрагментов. Это почти всегда убивает конверсию.

## 2. Внешний наблюдатель: как сайт читается сейчас

### 2.1. Что видно за 10 секунд

За первые секунды видно:

- двуязычный персональный сайт;
- человек явно умеет писать, структурировать и собирать цифровые штуки;
- есть продуктовый и инженерный словарь;
- есть GitHub и проекты, то есть за фасадом есть реальная работа.

Это хороший старт. Но за 10 секунд пока неясно:

- кто твой идеальный клиент;
- какой тип задач ты решаешь лучше других;
- почему именно тебе стоит писать, если у человека уже есть разработчик, PM или агентство;
- почему твоя широта — это сила, а не размытость.

### 2.2. Что видно за 60 секунд

Если человек читает главную чуть глубже, он понимает:

- ты работаешь на стыке продукта, UX и инженерии;
- умеешь доводить вещи до релиза;
- у тебя есть AI-кейсы и продукты;
- ты держишь публичный след.

Но в этот же момент рождается и сомнение:

- breadth высокий, а framing недостаточно конкретный;
- не до конца понятно, кого ты усиливаешь: founder’а, B2B-команду, small startup, ops-heavy бизнес, hiring manager’а;
- нет четкого ощущения “вот в каких задачах он особенно опасно хорош”.

### 2.3. Что видно за 5 минут

Через 5 минут умный читатель понимает, что ты действительно не поверхностный человек. Но и тут есть проблема:

- кейсы пока не докручены до глубины, которая превращает “интересный проект” в “доказательство judgement”;
- блог пока не поддерживает заявленную интеллектуальную роль;
- `About` пока объясняет тебя, но не моделирует опыт работы с тобой;
- часть trust surface на живом сайте выглядит unfinished.

Итоговое ощущение сейчас:

> “Человек сильный и, возможно, очень полезный, но мне еще нужно самому додумать, как именно его нанимать, на какие задачи и почему он лучше альтернатив.”

Для дорогой конверсии это плохой режим. Сильный персональный сайт должен не заставлять читателя додумывать, а снимать необходимость додумывать.

## 3. Главный стратегический диагноз

Сайт сейчас находится в неудобной промежуточной зоне между четырьмя типами:

- `portfolio`;
- `technical resume`;
- `founder / builder notebook`;
- `thoughtful personal blog`.

Он берет лучшее от каждого, но пока не доминирует ни в одном. Из-за этого нет ощущения “неизбежности” твоего позиционирования.

### 3.1. Не хватает категории, в которую ты помещаешься сразу

Самая дорогая роль, в которой тебя выгодно подавать:

- `AI product builder`
- `product engineer for messy, high-leverage problems`
- `operator-builder for AI and digital products`

Это не официальный job title. Это рабочая категория восприятия.

Именно ее сайт должен зафиксировать у человека в голове.

Сейчас же сайт фиксирует другое:

- “intersection of product, UX, engineering”
- “Product Manager / Product Engineer”

Это умно, но слишком похоже на category soup.

Проблема таких формулировок в том, что они нравятся тем, кто уже ценит междисциплинарность, но плохо продают себя тем, кто принимает решение быстро и на основе risk reduction.

### 3.2. Сайт продает capability, а не cost of collaboration

Умный клиент редко спрашивает “умеешь ли ты?” Он спрашивает:

- “сколько менеджмента ты потребуешь?”;
- “поймешь ли ты задачу без тонны hand-holding?”;
- “сможешь ли ты сам собрать структуру?”;
- “можно ли тебе доверить ambiguous zone?”;
- “не построишь ли ты AI theatre вместо полезной системы?”;
- “умеешь ли ты спорить по делу и выбирать trade-offs?”.

Сильный сайт продает не только skill, но и low management overhead.

Твой сайт пока не до конца доносит именно это.

### 3.3. Широта пока читается как перечисление, а не как система

Ты хочешь, чтобы человек видел:

`product + AI + fullstack + DevOps = один end-to-end человек`

Но без правильного narrative frame это же самое легко читается как:

`немного PM, немного инженер, немного AI, немного всего`

Разница между этими двумя прочтениями — это весь вопрос позиционирования.

Сайт должен объяснять не “я делаю все”, а:

> “Есть конкретный класс задач, где ценность появляется именно потому, что я могу держать продуктовую логику, UX, implementation и запуск в одной голове.”

### 3.4. Proof-of-work есть, но proof-of-judgement пока слабее

На сайте уже есть:

- GitHub;
- проекты;
- блог;
- свой собственный продукт в виде сайта.

Но дорогой покупатель ищет не только след активности. Он ищет evidence of judgment:

- как ты формулируешь проблему;
- как выбираешь, что не делать;
- как работаешь с риском;
- как думаешь об AI не как о модном слове, а как о practical layer;
- как обосновываешь компромиссы.

Именно этого пока меньше, чем нужно.

## 4. Кто твой реальный покупатель

Если посмотреть на желаемый outcome, твой сайт должен быть особенно силен для четырех типов людей.

### 4.1. Founder или co-founder ранней стадии

Это человек, у которого:

- есть идея или рынок;
- есть ощущение боли;
- нет идеально сформулированной продуктовой структуры;
- нет желания собирать отдельно PM + designer + engineer + AI person.

Что он хочет услышать:

- “этот человек быстро понимает хаос”;
- “с ним можно пройти от ambiguity к working thing”;
- “он не будет заниматься AI-театром”;
- “он может принять много правильных решений без постоянного присмотра”.

### 4.2. Операционный B2B-владелец или руководитель

Это человек, у которого:

- уже есть процесс, в котором слишком много ручного труда;
- есть боль в воронке, данных, отчетности, QA, документах, workflow или profitability;
- есть интерес к AI, но нет терпения на бессмысленный R&D.

Что он хочет услышать:

- “этот человек понимает операционную боль, а не только интерфейсы”;
- “он умеет в automation + product + implementation”;
- “он может сделать полезную систему, а не слайд-дек про AI”.

### 4.3. Hiring manager для сильной роли

Это человек, который смотрит не только на hard skills, но и на shape of mind.

Что он хочет услышать:

- “это high-agency человек”;
- “он умеет и думать, и делать”;
- “он умеет брать ownership beyond job description”.

### 4.4. Партнер по коллаборации

Это другой builder, founder или operator, которому нужен не подрядчик, а надежный интеллектуальный соавтор в продуктовой зоне.

Что он хочет услышать:

- “мы говорим на одном языке”;
- “этот человек может усиливать мою систему, а не просто исполнять задачи”.

## 5. Что на самом деле должно быть ядром сайта

Твой сайт не должен быть:

- агентским сайтом;
- резюме в браузере;
- indie hacker-блогом;
- generic AI-consultant landing page;
- дизайнерским портфолио с красивыми карточками.

Он должен быть:

> personal operating profile редкого типа специалиста, который умеет брать ambiguous product work и доводить ее до working, commercially meaningful systems.

Это очень важная смена фокуса.

## 6. Benchmark: какие персональные сайты реально полезно сравнивать

Ниже не просто список “конкурентов”, а карта разных моделей персонального позиционирования.

## 6.1. Operator-builders

### Mitchell Bryson

Источник: [mitchellbryson.com](https://www.mitchellbryson.com/)

Что важно:

- Hero сразу говорит, что он делает: full-stack AI software engineer.
- Следующей строкой он обещает не общую AI-экспертизу, а `practical AI systems that cut manual work and improve margins`.
- Дальше идет контент, проекты, работа, contact.

Почему это сильный референс:

- Он не стесняется operational value language.
- Он продает не “AI passion”, а `manual work down / margins up`.
- У него breadth выглядит как система, потому что сфокусирован на одном классе ценности.

Что взять:

- Формулировки на языке экономического эффекта.
- Логику “small, verifiable wins that go live fast, then scale”.
- Очень быстрое соединение `identity -> value -> evidence -> contact`.

Чего не брать:

- Лобовой service layer, если хочется сохранить более subtle tone.

### Matthew Spence

Источник: [msaspence.com](https://msaspence.com/)

Что важно:

- Это почти не “портфолио”, а сверхплотное доказательство системного веса.
- Он показывает quantified achievements, remote-team experience, technical leadership, architecture, product and leadership together.
- Есть сильная language of impact, а не только language of skill.

Почему это сильный референс:

- У него breadth не выглядит как размытость, потому что все собрано вокруг тяжести результатов.
- Он явно показывает, что может быть bridge between technical strategy and product execution.

Что взять:

- Плотный язык impact.
- Явное объяснение “I bridge the gap...”.
- Логику, в которой experience — это доказательство системного влияния, а не хронология.

Чего не брать:

- Слишком резюмеобразную массу информации.
- Перегруз деталями биографии на раннем этапе сайта.

### Pieter Levels

Источник: [levels.io](https://levels.io/)

Что важно:

- Его сайт предельно прост, но narrative crystal clear.
- Он сразу говорит, кто он, что сделал, какие продукты построил, какую идею продвигает.
- Контакт и thesis находятся очень близко друг к другу.

Почему это сильный референс:

- Он показывает силу простой, прямой identity.
- Его breadth не ломает позиционирование, потому что оно подчинено одной builder-thesis.

Что взять:

- Ясность.
- Смелость говорить через concrete outcomes и продукты.
- Простую связку “кто я -> что я построил -> где меня читать -> как со мной связаться”.

Чего не брать:

- Излишне дерзкий или indie-rough tone, если хочешь звучать надежнее для B2B и более зрелых клиентов.

## 6.2. Thought-led operators

### Simon Willison

Источник: [simonwillison.net](https://simonwillison.net/)

Что важно:

- Сайт почти полностью построен вокруг public work trail.
- У него нет ощущения “продающего сайта”, но доверие огромное, потому что он постоянно публикует инструменты, заметки, релизы, наблюдения.
- Там есть `About`, `Subscribe`, `TILs`, `Tools`, а сама лента — бесконечное доказательство того, что человек живет в материале.

Почему это сильный референс:

- Это модель сайта, который продает через continuity, а не через polished claims.

Что взять:

- Идею регулярных небольших доказательств.
- Формат notes / links / tools как realistic content engine.

Чего не брать:

- Нельзя пытаться копировать объем.
- Это работает только при высокой частоте публичной работы.

### Julie Zhuo

Источник: [juliezhuo.com](https://www.juliezhuo.com/)

Что важно:

- Сайт очень компактный.
- Она не объясняет себя долго, а просто показывает role stack: founder, author, essayist.
- Дальше сразу идут selected writing and talks.

Почему это сильный референс:

- Очень хороший пример identity through curation.
- Нет лишнего шума, но есть высокий статус и интеллектуальный вес.

Что взять:

- Лаконичность.
- Формат “роль -> selected work”.
- Отказ от избыточного self-explanation, если за тебя уже говорит сильный корпус материалов.

Чего не брать:

- Такой уровень компактности работает только при уже сильном external reputation.

### Shreyas Doshi

Источник: [shreyasdoshi.com](https://shreyasdoshi.com/)

Что важно:

- Очень явный service/contact layer.
- Много контента и социального proof.
- Четкая логика `who I am -> let’s work together -> updates -> services`.

Почему это сильный референс:

- Хорошо показывает, как authority, teaching, advising и contact могут жить на одном сайте.

Что взять:

- Контраст между identity и actionable invitation.
- Понимание, что постоянные updates укрепляют ощущение живого человека, а не замороженного портфолио.

Чего не брать:

- Излишне явный advising/coaching framing, если твоя цель шире и build-first.

### Wes Kao

Источник: [weskao.com](https://www.weskao.com/)

Что важно:

- Сайт очень быстро объясняет, кто она, что уже сделала, что делает сейчас и какой content/product loop поддерживает ее репутацию.
- Есть четкая audience definition: operators, tech leaders, people who care about communication and growth.

Почему это сильный референс:

- Хорошо показывает, как сайт может быть одновременно personal, commercial и intellectually coherent.

Что взять:

- Сборку identity через `past credibility -> current focus -> newsletter -> paid products`.
- Ясность target audience.

Чего не брать:

- Creator-first structure, если core value у тебя все же execution, а не education.

### Lenny Rachitsky

Источник: [lennyrachitsky.com](https://lennyrachitsky.com/)

Что важно:

- Первая же строка делает identity crystal clear.
- После identity сразу идет one-line value proposition.
- Дальше сайт выстроен вокруг engine of trust: newsletter, podcast, community, library.

Почему это сильный референс:

- Отличный пример того, как сайт может быть очень простым, но extremely legible.

Что взять:

- Простоту.
- Отказ от “рассказывать все” в пользу “сказать главное и показать engine”.

Чего не брать:

- Creator-business DNA как главную модель.

## 6.3. Polished portfolio / service patterns

### Alison Conley

Источник: [alisonconley.com](https://www.alisonconley.com/)

Что важно:

- Есть ясная navigation logic: work, about, contact, services.
- Все очень читаемо для клиента.

Что взять:

- Структурную дисциплину.
- Понятные точки входа.

Чего не брать:

- Риск стать “еще одним красивым сервисным сайтом”.

### Isuru Ranaweera

Источник: [isururanaweera.com](https://isururanaweera.com/)

Что важно:

- Есть характер и личность.

Что это показывает:

- Визуальная индивидуальность сама по себе не продает дорогую cross-functional value.

Что взять:

- Разрешение быть немного личным.

Чего не брать:

- Дизайн без business legibility.

## 6.4. Что видно из benchmark в целом

Сильные персональные сайты почти всегда делают одну из трех вещей очень хорошо:

1. Очень быстро фиксируют identity.
2. Очень быстро показывают proof-of-work.
3. Очень быстро объясняют, как с человеком взаимодействовать.

Слабые персональные сайты обычно делают противоположное:

- дают много вкуса, но мало ценности;
- дают много возможностей, но мало категории;
- дают много навыков, но мало narrative.

## 7. Глубокий разбор `rebsem.ru` по слоям

Важно: ниже логика построена не по страницам, а по функциям сайта как инструмента конверсии.

## 7.1. Narrative Layer: что сайт утверждает о тебе

Сейчас утверждение звучит примерно так:

> “Я человек на стыке продукта, UX, AI и инженерии.”

Это хорошая исходная мысль, но слабая финальная формула.

Почему:

- она слишком похожа на self-description, а не на market position;
- она не выделяет один класс проблем;
- она не показывает why this combination matters;
- она звучит умно, но не обязательно дорого.

Что нужно вместо этого:

> “Я беру продуктовые задачи, которые еще не имеют ясной формы, и превращаю их в рабочие AI- и цифровые системы.”

или

> “Я полезен там, где продукт, AI и реализация еще не разделимы на разные роли.”

Ключевая идея: framing должен идти от nature of the problem, а не от списка ролей.

## 7.2. Evidence Layer: как сайт доказывает, что словам можно верить

Сейчас evidence stack состоит из:

- GitHub;
- проекты;
- блог;
- LinkedIn / соцссылки;
- техническая аккуратность самого сайта.

Это хороший набор. Но он собран не в иерархию, а в соседство.

Что нужно доказать дорогому клиенту:

- ты умеешь собирать problem framing;
- ты умеешь принимать trade-offs;
- ты умеешь связывать продуктовую логику и implementation;
- ты понимаешь, где AI нужен, а где нет;
- ты умеешь доводить дело до workable state.

Где это лучше всего доказывается:

- не в GitHub как таковом;
- не в списке технологий;
- а в case-study structure и в writing.

Вывод:

GitHub — это secondary proof, а не главный proof. Главным proof должны стать:

- flagship-case;
- 2-3 сильных supporting cases;
- 4-6 очень точных мыслей/публикаций.

## 7.3. Home как квалифицирующий слой

Сильная главная страница должна не “представлять тебя”, а быстро квалифицировать:

- кто должен читать дальше;
- кто не должен;
- по каким причинам стоит открыть кейсы;
- почему твоя широта — это именно полезная широта.

Сейчас `Home`:

- приятный;
- собранный;
- не кричащий;
- технически credible.

Но он пока недостаточно квалифицирует.

Ему не хватает:

- best-fit audience language;
- problem framing;
- text-level invitation;
- одного очень ясного flagship proof рядом с hero.

## 7.4. About как de-risking page

Сейчас `About` в значительной степени дублирует Home.

Что должна делать хорошая `About` для твоего типа позиции:

- объяснять working style;
- снижать collaboration anxiety;
- делать тебя понятным как partner in ambiguity;
- показывать границы и strongest fit.

Хорошая `About` должна отвечать:

- какие задачи тебе подходят;
- как ты обычно входишь в контекст;
- как выглядишь полезным уже в первые недели;
- что получит команда от твоего способа работы;
- что не является твоим best fit.

Сейчас этого мало.

## 7.5. Projects как revenue surface

Сейчас проекты — это скорее curated list, чем revenue-generating proof system.

Главная глубинная проблема не в количестве кейсов, а в том, что кейсы пока больше описывают продукт, чем твою ценность внутри продукта.

Сильный кейс должен отвечать не только на:

- что это за проект;
- какой стек;
- какой тип приложения.

Но и на:

- в чем была business / operational pain;
- какая часть этой боли была product problem;
- где именно ты принял решение;
- что изменилось после твоих решений;
- что этот кейс доказывает о тебе как о специалисте.

Пока проектные страницы часто читаются как “интересные описания”, а не как “decision-making evidence”.

## 7.6. Blog как engine of judgment

Здесь проблема глубже, чем “мало постов”.

Проблема в том, что без content engine твоя роль `product + AI + builder` не получает достаточно интеллектуального веса.

Для такой позиции блог нужен не ради SEO и не ради “контент-маркетинга”.

Он нужен, чтобы человек понял:

- как ты думаешь;
- какие distinctions ты умеешь делать;
- в чем ты не согласен с generic industry narratives;
- где ты видишь реальную ценность AI;
- как ты видишь работу под неопределенностью.

То есть блог должен производить evidence of taste and judgment.

Сейчас этого слоя почти нет.

## 7.7. GitHub как proof-of-work

GitHub на сайте — хорошая идея. Но у него есть две стратегические проблемы.

Первая:

- для внешнего бизнес-читателя это не всегда primary proof.

Вторая:

- на первом рендере trust block выглядит слабее, чем должен.

Глубинный вывод здесь такой:

- GitHub хорош как supporting signal;
- плохо, если он становится главным сигналом;
- совсем плохо, если supporting signal на первом контакте выглядит broken или empty.

Для твоего позиционирования GitHub должен поддерживать narrative, а не заменять его.

## 7.8. Двуязычие как показатель зрелости

RU/EN слой у тебя важнее, чем кажется.

Для твоего целевого рынка двуязычие — это не просто удобство. Это signal of international readiness.

Когда RU и EN живут не как полноправные поверхности, а как “одна основная плюс немного перевода”, это снижает воспринимаемую зрелость.

На глубоком уровне двуязычие здесь выполняет три функции:

- показывает способность мыслить сразу в двух аудиториях;
- снижает трение для международного контакта;
- демонстрирует внимание к деталям.

Поэтому любые англоязычные хвосты на RU-страницах работают не просто как локализационный баг, а как micro-fracture in trust.

## 7.9. Visual Layer: какой тип человека читается через дизайн

Здесь проблема не в том, что дизайн плохой. Он хороший. Но он кодирует немного не тот баланс.

Что сейчас читается визуально:

- техническая аккуратность;
- инженерный вкус;
- сдержанность;
- немного “личного репозитория”;
- moderate craft, low bullshit.

Это плюс. Но есть и минус:

- слишком моноширинный и технический характер визуальной системы слегка переусиливает образ engineer-builder и недосигнализирует product taste, editorial confidence и premium strategic maturity.

Иными словами:

сайт выглядит credible, но пока не выглядит sufficiently inevitable.

Тебе не нужен глянец. Но тебе нужен более явный баланс между:

- `builder`;
- `operator`;
- `writer / thinker`.

Сейчас визуальная часть сильнее всего кодирует `builder`.

## 7.10. Contact Layer: как человек решает тебе написать

Сейчас контакт technically easy:

- Telegram;
- email;
- LinkedIn;
- GitHub.

Но psychologically not fully framed.

Сильный contact layer отвечает на невысказанный вопрос:

> “По какому поводу мне вообще уместно писать этому человеку?”

Тебе не нужен агрессивный CTA.

Но нужен мягкий framing вроде:

- какие типы задач тебе интересны;
- какие команды тебе подходят;
- в какой ситуации лучше всего писать;
- чем будет полезен первый разговор.

Это особенно важно для умных осторожных людей, которые не любят “sales”, но любят ясность.

## 8. Где сайт силен на глубоком уровне

### Сильная сторона 1: у сайта уже есть скелет доверия

Многие персональные сайты страдают не от слабого текста, а от отсутствия реального скелета. У тебя скелет уже есть:

- кейсы;
- блог;
- GitHub;
- RU/EN;
- public identity;
- собственный работающий продукт в виде самого сайта.

Это очень хороший старт.

### Сильная сторона 2: ты не выглядишь фейковым AI-консультантом

Это серьезное конкурентное преимущество. Сейчас рынок полон людей, которые:

- пишут про AI;
- продают AI;
- консультируют по AI;
- но не выглядят как люди, реально строящие системы.

У тебя уже есть шанс выглядеть как opposite archetype:

> человек, который не продает “AI strategy decks”, а строит полезные цифровые системы.

Это нужно усиливать.

### Сильная сторона 3: breadth у тебя настоящий, а не декоративный

Сайт показывает не только front-end taste, не только PM jargon и не только coding hobby. У тебя действительно есть широкий диапазон.

Это очень ценно. Но только при одном условии: breadth must be subordinated to a thesis.

### Сильная сторона 4: тон сайта взрослый и без кринжа

Это редкость. Нет ощущения:

- дешевого self-promotion;
- motivational fluff;
- “I’m passionate about innovation” nonsense;
- фальшивого founder theatre.

Это большое преимущество для аудитории, которую ты хочешь притянуть.

## 9. Где сайт слаб именно стратегически

### Слабость 1: category ambiguity

Сайт пока не закрывает вопрос:

> “Что это за редкий тип специалиста и в каких задачах он особенно хорош?”

### Слабость 2: недостаточно острое value framing

Слишком много языка capability и недостаточно языка value:

- `clarity`
- `ambiguity`
- `launch`
- `systems`
- `ownership`
- `manual work reduction`
- `operational leverage`
- `practical AI`

### Слабость 3: кейсы еще не продают decision-making

Они продают “интересные продукты”, но недостаточно продают “как ты думаешь и чем ты полезен”.

### Слабость 4: content engine слишком тонкий

Без него ты остаешься в категории “интересный generalist”, а не переходишь в категорию “trusted operator-thinker”.

### Слабость 5: сайт не до конца объясняет, зачем писать именно сейчас

Контактный слой есть, но invitation layer пока слишком implicit.

## 10. Что сайт должен утверждать после переписывания

Идеальный reader takeaway:

> “Если у нас есть AI-heavy или operationally messy product problem, и нужен человек, который может быстро собрать структуру, принять продуктовые решения и довести систему до работающего состояния — это очень сильный кандидат.”

Вторая идеальная мысль:

> “Он не просто кодит и не просто менеджерит. Он понимает продуктовую логику и умеет руками довести ее до результата.”

Третья:

> “Он не выглядит как человек, который принесет complexity theatre.”

## 11. Новый каркас позиционирования

Ниже — не финальный copy deck, а strategic structure, на которой должен держаться сайт.

### 11.1. Core thesis

Главная мысль сайта должна звучать примерно так:

> Я беру неясные продуктовые задачи и превращаю их в работающие AI- и цифровые системы — от problem framing и workflow design до implementation и запуска.

### 11.2. Best-fit problems

На сайте нужно очень явно показать, что ты особенно полезен в задачах, где:

- есть хаос, но есть потенциал;
- AI нужен для реального workflow, а не для шоу;
- нужен человек, который понимает и продукт, и реализацию;
- нельзя позволить себе длинную цепочку из 4-5 ролей;
- важна скорость движения от ambiguity к working system.

### 11.3. Anti-fit

Очень полезно показать, где ты не лучший выбор.

Например:

- teams that only need narrow task execution from a large predefined backlog;
- long bureaucratic organizations with heavy specialization and slow decision-making;
- situations where no one is willing to make product trade-offs.

Это не отпугивает правильных людей. Это повышает доверие.

## 12. Как должен быть устроен обновленный сайт

## 12.1. Home should qualify, not summarize

Home должна:

- назвать тип задач;
- назвать тип клиента;
- быстро показать flagship proof;
- мягко предложить контакт;
- провести человека к кейсам и текстам.

## 12.2. About should de-risk collaboration

About должна:

- показывать способ мышления;
- объяснять рабочую модель;
- снижать неопределенность;
- отвечать на “как это — работать с тобой?”.

## 12.3. Projects should prove judgment

Projects должны:

- показывать не только built things;
- а показывать pattern of problem-solving.

## 12.4. Blog should create authority

Блог должен:

- давать distinctions;
- показывать taste;
- делать тебя интересным не только как builder, но и как interpreter of messy systems.

## 12.5. LinkedIn should translate the same thesis into corporate language

LinkedIn не должен повторять сайт один в один.

Сайт должен продавать depth and taste.
LinkedIn должен переводить это в:

- headline clarity;
- role readability;
- executive / hiring-friendly language.

## 13. Concrete rewrite recommendations

## 13.1. Hero: не с роли, а с класса задач

Текущий язык хорош по тону, но слаб по differentiation.

Лучшие направления:

### Вариант A

RU:

> Собираю AI- и цифровые продукты с нуля: от распутывания задачи и логики продукта до интерфейса, интеграций и реального запуска.

EN:

> I build AI and digital products from zero: from untangling the problem and shaping the product to shipping the interface, integrations, and real launch.

### Вариант B

RU:

> Помогаю превращать неясные продуктовые задачи в работающие системы: продуктовая логика, AI-слой, интерфейс, интеграции и запуск.

EN:

> I turn ambiguous product problems into working systems: product logic, AI layer, interface, integrations, and launch.

### Вариант C

RU:

> Лучше всего полезен там, где задачу еще нужно собрать, а не просто быстро исполнить.

EN:

> I am most useful when the problem still needs structure, not just execution.

### Вариант D

RU:

> Работаю на стыке продукта, AI и инженерии. Беру messy задачи и довожу их до MVP, автоматизации, первой выручки или стабильного рабочего контура.

EN:

> I work across product, AI, and engineering. I take messy problems and push them to MVP, automation, first revenue, or a stable operating loop.

### Рекомендация

Лучший вектор — B или D.

Они:

- не звучат как резюме;
- не звучат как агентство;
- не распадаются на список ролей;
- показывают, что breadth у тебя подчинен классу задач.

## 13.2. Home micro-CTA

Нужен один короткий текст под social links.

Примеры:

RU:

- `Открыт к задачам, где продукт, AI и реализация еще не разделимы на разные роли.`
- `Если вам нужен человек, который может пройти путь от неясной задачи до работающей системы, проще всего написать мне напрямую.`

EN:

- `Open to projects where product logic, AI, and implementation still need to live in the same person.`
- `If you need someone who can go from ambiguity to a working system, the easiest way to reach me is directly.`

## 13.3. `About`: новый каркас

Рекомендую заменить текущий explanatory format на такую структуру:

1. `What I do best`
2. `How I usually work`
3. `Where I add the most value`
4. `What good collaboration with me looks like`
5. `What I am not optimizing for`
6. `Current focus`

Это будет сильнее, чем просто 4-5 аккуратных абзацев про тебя.

## 13.4. Flagship case

Главный flagship — `Cursivo`.

Но подавать его надо не как “CRM для автопроката”, а как кейс про:

- fragmented operations;
- lead leakage;
- document/risk qualification;
- profitability visibility;
- AI as decision support, not decoration;
- unified system replacing spreadsheets and lagging manual workflow.

Новая framing line может быть такой:

> AI-assisted operating system for car rental teams: from lead handling and client screening to fleet profitability and managerial visibility.

## 13.5. Supporting cases

Поддерживающий набор должен быть не “все подряд”, а curated proof of range:

- `Obrabot`: AI + operations + QA workflow
- `Zodial`: automation pipeline + payments + generation + delivery
- `Portfo`: self-packaging, SEO, trust system design
- `BazaBot`: lightweight automation with direct cost reduction
- `Slopiq`: product taste and consumer-facing range

## 13.6. Новый шаблон кейса

Каждая сильная project page должна иметь один и тот же скелет:

1. `Context`
2. `Problem`
3. `Why it mattered`
4. `My role`
5. `What I changed`
6. `Trade-offs`
7. `Outcome`
8. `What this case proves about me`

Последний блок особенно важен. Он превращает кейс из рассказа о продукте в доказательство твоего типа мышления.

## 13.7. Content engine

Тебе не нужен “большой блог”. Тебе нужен working publishing system.

Лучшая модель:

- 1 substantive post раз в 2-3 недели;
- 1 короткая note в неделю;
- 1 адаптированный LinkedIn post из уже существующей мысли.

### Лучшие темы для старта

1. Почему AI-проекты чаще ломаются на постановке задачи, чем на модели
2. Как понять, что AI-фича действительно нужна продукту
3. Что такое хороший первый релиз AI-heavy продукта
4. Как я собираю задачу, когда у команды есть ощущение боли, но нет структуры
5. Где заканчивается PM и начинается product engineer
6. Какие процессы действительно стоит автоматизировать в первой версии, а какие нет

## 13.8. LinkedIn

### Headline

Рабочие варианты:

- `AI Product Builder | Product Manager + Full-Stack + DevOps | From ambiguity to working systems`
- `Product Engineer for AI & Digital Products | Discovery, workflow design, build, launch`
- `I turn ambiguous product problems into working AI systems, clear UX, and shipped products`

### About

Главная цель `About` в LinkedIn:

- не перечислить стек;
- не дублировать сайт;
- а перевести тебя на язык, который читают hiring managers, founders и executives.

Пример opening:

> I work at the intersection of product, AI, UX, and engineering. I am most useful when a team has a promising product direction but the path from idea to working system is still unclear.

Дальше:

- types of problems;
- what you can own end-to-end;
- what teams you fit best;
- current focus;
- light invitation to connect.

### Featured

Лучший набор для `Featured`:

1. `rebsem.ru`
2. flagship-case
3. один сильный blog post
4. один GitHub/public artifact

## 14. Что стоит сделать сразу, а что потом

## Now

- переписать hero и micro-CTA;
- убрать все unfinished signals с публичной поверхности;
- пересобрать `Cursivo` как flagship-case;
- исправить локализацию и SEO/i18n trust layer;
- переписать `About` под working model.

## Next

- переставить проекты под commercial logic;
- переформулировать приватные кейсы как anonymized proof;
- завести регулярный content engine;
- синхронизировать LinkedIn с новой тезисной рамкой.

## Later

- добавить `Now` page или short notes format;
- сделать richer project proof: diagrams, screenshots, workflow before/after;
- усилить email / contact framing только если появится реальный inbound.

## 15. Самая важная мысль напоследок

Тебе не нужно делать сайт громче.

Тебе нужно сделать его:

- более определенным;
- более зрелым в language of value;
- более доказательным в кейсах;
- более регулярным в интеллектуальном следе;
- более ясным в том, кому и зачем стоит писать.

Сейчас сайт производит впечатление:

> “сильный, аккуратный, интересный generalist.”

После правильной переписи он должен производить впечатление:

> “редкий operator-builder, которому можно доверить messy AI/product problem и получить не разговор, а работающую систему.”

Это и есть та разница, которая лучше всего конвертируется в:

- платные проекты;
- коллаборации;
- сильные роли;
- качественные входящие.

## 16. Appendix: конкретные наблюдения и ссылки

### Живой сайт

- [Главная EN](https://rebsem.ru/)
- [Главная RU](https://rebsem.ru/ru/)
- [About EN](https://rebsem.ru/about/)
- [About RU](https://rebsem.ru/ru/about/)
- [Cursivo RU case](https://rebsem.ru/ru/projects/cursivo-ru/)
- [GitHub profile JSON](https://rebsem.ru/api/github/profile.json)
- [GitHub contributions JSON](https://rebsem.ru/api/github/contributions.json)
- [GitHub repos JSON](https://rebsem.ru/api/github/repos.json)

### Кодовая база

- [`src/pages/index.astro`](../src/pages/index.astro)
- [`src/pages/ru/index.astro`](../src/pages/ru/index.astro)
- [`src/pages/about.astro`](../src/pages/about.astro)
- [`src/pages/ru/about.astro`](../src/pages/ru/about.astro)
- [`src/data/site-content.ts`](../src/data/site-content.ts)
- [`src/data/projects.ts`](../src/data/projects.ts)
- [`src/components/SocialLinks.astro`](../src/components/SocialLinks.astro)
- [`src/components/SiteFooter.astro`](../src/components/SiteFooter.astro)
- [`src/layouts/Layout.astro`](../src/layouts/Layout.astro)
- [`src/scripts/github-activity.js`](../src/scripts/github-activity.js)
- [`src/scripts/github-sync.js`](../src/scripts/github-sync.js)
- [`src/content/projects/cursivo-ru.mdx`](../src/content/projects/cursivo-ru.mdx)
- [`src/scripts/launch-timer.js`](../src/scripts/launch-timer.js)
- [`src/pages/sitemap.xml.ts`](../src/pages/sitemap.xml.ts)

### Benchmark

- [Mitchell Bryson](https://www.mitchellbryson.com/)
- [Matthew Spence](https://msaspence.com/)
- [Simon Willison](https://simonwillison.net/)
- [Julie Zhuo](https://www.juliezhuo.com/)
- [Shreyas Doshi](https://shreyasdoshi.com/)
- [Wes Kao](https://www.weskao.com/)
- [Lenny Rachitsky](https://lennyrachitsky.com/)
- [Pieter Levels](https://levels.io/)
- [Alison Conley](https://www.alisonconley.com/)
- [Isuru Ranaweera](https://isururanaweera.com/)

### LinkedIn

- [Mikhail Semenov on LinkedIn](https://www.linkedin.com/in/mikhail-semenovv/)

---

Если делать только три вещи в правильном порядке, я бы делал так:

1. Зафиксировать категорию: кто ты и для какого класса задач ты лучший выбор.
2. Пересобрать flagship-case так, чтобы он доказывал judgement, а не просто описывал продукт.
3. Построить регулярный content layer, который укрепит образ operator-builder’а, а не просто талантливого generalist’а.
