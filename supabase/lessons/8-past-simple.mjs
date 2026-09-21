import { ch, inp, fix, ord, group, formula, table, examples, pit, no, yes, sticky, h3, p, compare, ng, html, extend } from "./_helpers.mjs";

// The course links lessons together: every new topic says where it was met before.
const link = text => sticky(text, "Связь с курсом");

const lesson = {
  slug: "past-simple",
  title: "Прошедшее время: Past Simple",
  subtitle: "was / were, окончание -ed, неправильные глаголы, didn't и did, вопросы о прошлом",
  position: 7,
  sections: [
    {
      id: "was", nav: "was · were", eyebrow: "Тема 1 · прошлое to be", title: "was и were — «был», «была», «были»",
      theory: html(
        p("В уроке 1 вы уже видели <b>was</b> и <b>were</b>. Это прошедшее время глагола to be: там, где сейчас am / is / are, в прошлом стоит was или were."),
        table(["Кто", "Сейчас", "В прошлом", "Пример"], [
          ["I", "am", "<mark>was</mark>", "I was at home."],
          ["he / she / it", "is", "<mark>was</mark>", "The film was boring."],
          ["we / you / they", "are", "<mark>were</mark>", "They were at school."],
        ]),
        h3("Отрицание и вопрос"),
        formula("кто", "!wasn't · weren't", "остальное"),
        formula("!Was · Were", "кто", "остальное", "?"),
        table(["Вопрос", "Да", "Нет"], [
          ["<mark>Were</mark> you at work?", "Yes, I was.", "No, I wasn't."],
          ["<mark>Was</mark> she happy?", "Yes, she was.", "No, she wasn't."],
        ]),
        h3("Слова-подсказки про прошлое"),
        table(["Слово", "Значение", "Пример"], [
          ["yesterday", "вчера", "I was ill yesterday."],
          ["last night / week / year", "вчера вечером / на прошлой неделе / в прошлом году", "We were in Sochi last year."],
          ["two days ago", "два дня назад", "She was here two days ago."],
          ["in 2020", "в 2020 году", "They were students in 2020."],
        ]),
        examples([
          ["Вчера было холодно.", "It <mark>was</mark> cold yesterday.", "погода — It was"],
          ["Билеты были дорогие.", "The tickets <mark>were</mark> expensive.", "tickets = they → were"],
          ["Меня не было дома в субботу.", "I <mark>wasn't</mark> at home on Saturday."],
        ]),
        pit(
          `Один — was, несколько — were: ${no("They was at home.")} ${yes("They were at home.")}`,
          `В прошлом to be не нужен рядом с was: ${no("I was be tired.")} ${yes("I was tired.")}`
        ),
        link("Урок 1, тема 1: am / is / are · Урок 1, тема 10: первые примеры с was / were")
      ),
      groups: [
        group("was или were?", [
          ch("I ___ at the cinema yesterday.", ["was", "were"], "was", "I → was."),
          ch("My parents ___ very tired last night.", ["was", "were"], "were", "parents = they → were."),
          ch("The weather ___ terrible on Sunday.", ["was", "were"], "was", "weather = it → was."),
          ch("You ___ right!", ["was", "were"], "were", "you → were."),
          ch("We ___ at the same school in 2019.", ["was", "were"], "were", "we → were."),
          ch("The shops ___ closed.", ["was", "were"], "were", "shops = they → were."),
        ]),
        group("Отрицание и вопрос", [
          ch("She ___ at work yesterday. She was ill.", ["wasn't", "weren't", "didn't"], "wasn't", "she → wasn't."),
          ch("___ you at the party?", ["Was", "Were", "Did"], "Were", "you → Were."),
          ch("Was the hotel nice? — No, it ___.", ["wasn't", "weren't", "didn't"], "wasn't", "hotel = it → No, it wasn't."),
          ch("Were they at home? — Yes, they ___.", ["were", "was", "did"], "were", "Yes, they were."),
        ]),
        group("Поставьте в прошедшее время", [
          inp("I am at work.", ["I was at work."], "am → was.", "Напишите про вчера"),
          inp("They are in London.", ["They were in London."], "are → were.", "Напишите про вчера"),
          inp("The film isn't interesting.", ["The film wasn't interesting.", "The film was not interesting."], "isn't → wasn't.", "Напишите про вчера"),
          inp("Are you at school?", ["Were you at school?"], "Are → Were.", "Напишите про вчера"),
        ]),
        group("Нажмите на неправильное слово", [
          fix("My friends was at the concert.", "was", "were", "friends = they → were."),
          fix("It were very cold yesterday.", "were", "was", "It → was."),
          fix("Where was you last night?", "was", "were", "you → were: Where were you…?"),
        ]),
      ],
    },
    {
      id: "ed", nav: "-ed", eyebrow: "Тема 2 · правильные глаголы", title: "worked, lived, studied — окончание -ed",
      theory: html(
        p("У обычных глаголов прошедшее время образуется окончанием <b>-ed</b>. Форма одна для всех: и для I, и для he, и для they."),
        formula("кто", "!глагол + ed", "остальное"),
        compare(
          ["I work every day.", "Я работаю каждый день.", "Present Simple, урок 4"],
          ["I worked yesterday.", "Я работал вчера.", "Past Simple"]
        ),
        h3("Как добавлять -ed"),
        table(["Глагол кончается на…", "Что делаем", "Примеры"], [
          ["обычный случай", "+ <mark>ed</mark>", "work → worked · watch → watched · play → played"],
          ["-e", "+ <mark>d</mark>", "live → lived · like → liked · dance → danced"],
          ["согласная + y", "y → <mark>ied</mark>", "study → studied · carry → carried · try → tried"],
          ["короткий глагол на гласная + согласная", "буква удваивается", "stop → sto<mark>pp</mark>ed · plan → pla<mark>nn</mark>ed"],
        ]),
        examples([
          ["Вчера мы смотрели фильм.", "We <mark>watched</mark> a film yesterday."],
          ["Она жила в Берлине два года.", "She <mark>lived</mark> in Berlin for two years.", "форма та же, что у I"],
          ["Я учил английский в школе.", "I <mark>studied</mark> English at school.", "y → ied"],
        ]),
        h3("Как читается -ed"),
        table(["Звук", "Когда", "Примеры"], [
          ["/t/ — «т»", "после глухих: p, k, f, s, sh, ch", "worked · watched · stopped"],
          ["/d/ — «д»", "после звонких и гласных", "lived · played · listened"],
          ["/ɪd/ — «ид», лишний слог", "после t и d", "wanted · started · needed"],
        ]),
        pit(
          `Форма одна для всех: ${no("She workeds.")} ${no("He did worked.")} ${yes("She worked.")}`,
          `Не путайте с Present Simple: ${no("Yesterday I work late.")} ${yes("Yesterday I worked late.")}`
        ),
        link("Урок 4: I work · Урок 5: правила -s / -es похожи на правила -ed")
      ),
      groups: [
        group("Напишите прошедшее время", [
          inp("work →", ["worked"], "+ ed.", "Напишите форму прошедшего времени", "Обычный случай."),
          inp("live →", ["lived"], "Кончается на -e → + d.", "Напишите форму прошедшего времени", "Уже есть e."),
          inp("study →", ["studied"], "согласная + y → ied.", "Напишите форму прошедшего времени", "y меняется."),
          inp("stop →", ["stopped"], "Короткий глагол: буква удваивается.", "Напишите форму прошедшего времени", "Две p."),
          inp("play →", ["played"], "гласная + y → просто ed.", "Напишите форму прошедшего времени", "a перед y — гласная."),
          inp("watch →", ["watched"], "+ ed.", "Напишите форму прошедшего времени", "Обычный случай."),
        ]),
        group("Выберите правильную форму", [
          ch("Yesterday I ___ at home all day.", ["work", "worked", "working"], "worked", "yesterday → прошлое."),
          ch("She ___ in Moscow two years ago.", ["lives", "lived", "living"], "lived", "two years ago → прошлое."),
          ch("We ___ to music last night.", ["listen", "listened", "listens"], "listened", "last night → прошлое."),
          ch("They ___ football every Sunday.", ["play", "played"], "play", "every Sunday — привычка, настоящее."),
          ch("My brother ___ English at university in 2020.", ["study", "studied", "studies"], "studied", "in 2020 → прошлое."),
        ]),
        group("Соберите предложение", [
          ord("We watched a film yesterday.", "We + watched + a film + yesterday."),
          ord("She studied English at school.", "She + studied + English + at school."),
          ord("They stopped near the shop.", "They + stopped + near the shop."),
        ]),
      ],
    },
    {
      id: "irr", nav: "went · had · saw", eyebrow: "Тема 3 · неправильные глаголы", title: "Неправильные глаголы: их надо запомнить",
      theory: html(
        p("Самые частые глаголы образуют прошедшее время <b>по-своему</b>, без -ed. Их около двух десятков в базовом наборе — их просто учат наизусть."),
        table(["Сейчас", "В прошлом", "Пример"], [
          ["go — ходить, ездить", "<mark>went</mark>", "I went to the gym."],
          ["have — иметь", "<mark>had</mark>", "We had breakfast at 8."],
          ["do — делать", "<mark>did</mark>", "She did her homework."],
          ["get — получать, добираться", "<mark>got</mark>", "He got home late."],
          ["see — видеть", "<mark>saw</mark>", "I saw Anna yesterday."],
          ["make — делать, готовить", "<mark>made</mark>", "They made pizza."],
          ["take — брать", "<mark>took</mark>", "She took a taxi."],
          ["come — приходить", "<mark>came</mark>", "My friends came at 7."],
          ["say — говорить", "<mark>said</mark>", "He said «hello»."],
          ["eat — есть", "<mark>ate</mark>", "I ate a sandwich."],
          ["drink — пить", "<mark>drank</mark>", "We drank tea."],
          ["buy — покупать", "<mark>bought</mark>", "She bought a new phone."],
          ["meet — встречать", "<mark>met</mark>", "I met my friends."],
          ["write — писать", "<mark>wrote</mark>", "He wrote an email."],
          ["read — читать", "<mark>read</mark> (читается «рэд»)", "I read a book."],
        ]),
        examples([
          ["Вчера я ходил в спортзал.", "I <mark>went</mark> to the gym yesterday.", "go → went"],
          ["Мы поужинали в 9.", "We <mark>had</mark> dinner at 9.", "have → had"],
          ["Она купила новую сумку.", "She <mark>bought</mark> a new bag.", "buy → bought"],
        ]),
        pit(
          `К неправильным -ed не добавляют: ${no("I goed home.")} ${no("She buyed a car.")} ${yes("I went home.")} ${yes("She bought a car.")}`,
          `write → wrote вы уже видели в уроке 3, на стикере с доски.`
        ),
        link("Урок 3, тема 6: write — wrote · Урок 5: have → has, а в прошлом всегда had")
      ),
      groups: [
        group("Напишите прошедшее время", [
          inp("go →", ["went"], "go → went.", "Напишите форму прошедшего времени", "Начинается на w."),
          inp("have →", ["had"], "have → had.", "Напишите форму прошедшего времени", "Три буквы."),
          inp("see →", ["saw"], "see → saw.", "Напишите форму прошедшего времени", "Начинается на s."),
          inp("buy →", ["bought"], "buy → bought.", "Напишите форму прошедшего времени", "Кончается на -ought."),
          inp("take →", ["took"], "take → took.", "Напишите форму прошедшего времени", "Две o."),
          inp("eat →", ["ate"], "eat → ate.", "Напишите форму прошедшего времени", "Три буквы."),
          inp("come →", ["came"], "come → came.", "Напишите форму прошедшего времени", "Меняется o на a."),
          inp("meet →", ["met"], "meet → met.", "Напишите форму прошедшего времени", "Одна e."),
        ]),
        group("Выберите правильную форму", [
          ch("Last night we ___ a great film.", ["see", "saw", "seed"], "saw", "see → saw."),
          ch("She ___ to Italy last summer.", ["goed", "went", "goes"], "went", "go → went."),
          ch("I ___ coffee this morning.", ["drinked", "drank", "drink"], "drank", "drink → drank."),
          ch("He ___ his homework yesterday.", ["did", "done", "doed"], "did", "do → did."),
          ch("They ___ a taxi to the airport.", ["taked", "took", "take"], "took", "take → took."),
        ]),
        group("Нажмите на неправильное слово", [
          fix("I goed to the cinema on Friday.", "goed", "went", "go → went."),
          fix("She buyed a new dress.", "buyed", "bought", "buy → bought."),
          fix("We eated pizza last night.", "eated", "ate", "eat → ate."),
        ]),
      ],
    },
    {
      id: "neg", nav: "didn't · did", eyebrow: "Тема 4 · отрицание и вопрос", title: "didn't и did: глагол возвращается в начальную форму",
      theory: html(
        p("В отрицании и вопросе прошлое показывает <b>did</b>, а сам глагол становится <b>обычным</b>: без -ed и без особой формы. Это как с does в уроке 5 — «показатель времени один раз»."),
        table(["", "Утверждение", "Отрицание", "Вопрос"], [
          ["Правильный глагол", "I work<mark>ed</mark>.", "I <mark>didn't</mark> work.", "<mark>Did</mark> you work?"],
          ["Неправильный глагол", "I <mark>went</mark>.", "I <mark>didn't</mark> go.", "<mark>Did</mark> you go?"],
        ]),
        formula("кто", "!didn't", "глагол", "остальное"),
        formula("!Did", "кто", "глагол", "остальное", "?"),
        table(["Вопрос", "Да", "Нет"], [
          ["Did you see the film?", "Yes, I did.", "No, I didn't."],
          ["Did she call you?", "Yes, she did.", "No, she didn't."],
        ]),
        examples([
          ["Я вчера не работал.", "I <mark>didn't work</mark> yesterday.", "не didn't worked"],
          ["Она не ходила в школу.", "She <mark>didn't go</mark> to school.", "не didn't went"],
          ["Ты купил хлеб?", "<mark>Did</mark> you <mark>buy</mark> bread?", "не Did you bought"],
        ]),
        p("С <b>was / were</b> did не нужен: у to be свои отрицание и вопрос — wasn't, weren't, Was…?, Were…? (тема 1)."),
        pit(
          `${no("I didn't worked.")} ${yes("I didn't work.")}`,
          `${no("Did you went home?")} ${yes("Did you go home?")}`,
          `${no("Did you at home?")} ${yes("Were you at home?")}`
        ),
        link("Урок 4: don't и Do · Урок 5: doesn't и Does · здесь то же правило, только did")
      ),
      groups: [
        group("Выберите правильный вариант", [
          ch("I ___ to work yesterday.", ["didn't went", "didn't go", "don't went"], "didn't go", "После didn't — начальная форма go."),
          ch("___ you watch the match?", ["Did", "Do", "Was"], "Did", "watch — действие, прошлое → Did."),
          ch("She ___ her keys at home.", ["didn't take", "didn't took", "doesn't take"], "didn't take", "didn't + take."),
          ch("Did they like the hotel? — Yes, they ___.", ["did", "were", "liked"], "did", "Yes, they did."),
          ch("Did he call you? — No, he ___.", ["didn't", "wasn't", "doesn't"], "didn't", "No, he didn't."),
          ch("___ you at home on Sunday?", ["Did", "Were", "Do"], "Were", "at home — место, глагола-действия нет → Were."),
          ch("We ___ tired after the trip.", ["didn't", "weren't", "don't"], "weren't", "tired — какой → weren't."),
        ]),
        group("Сделайте отрицание", [
          inp("I watched TV last night.", ["I didn't watch TV last night.", "I did not watch TV last night."], "watched → didn't watch.", "Сделайте отрицание"),
          inp("She went to the party.", ["She didn't go to the party.", "She did not go to the party."], "went → didn't go.", "Сделайте отрицание"),
          inp("They had breakfast at home.", ["They didn't have breakfast at home.", "They did not have breakfast at home."], "had → didn't have.", "Сделайте отрицание"),
          inp("He was at school.", ["He wasn't at school.", "He was not at school."], "С to be — wasn't, без did.", "Сделайте отрицание"),
        ]),
        group("Задайте вопрос", [
          inp("You bought milk.", ["Did you buy milk?"], "Did + you + buy…?", "Превратите в вопрос"),
          inp("She saw the film.", ["Did she see the film?"], "Did + she + see…?", "Превратите в вопрос"),
          inp("They were at the beach.", ["Were they at the beach?"], "С to be: Were they…?", "Превратите в вопрос"),
        ]),
        group("Нажмите на неправильное слово", [
          fix("I didn't saw him yesterday.", "saw", "see", "После didn't — see."),
          fix("Did she went to the shop?", "went", "go", "После Did — go."),
          fix("Did you tired after work?", "Did", "Were", "tired — какой → Were you tired?"),
        ]),
      ],
    },
    {
      id: "wh", nav: "Where did you…?", eyebrow: "Тема 5 · вопросы о прошлом", title: "Where did you go? What did you do?",
      theory: html(
        p("Вопросительное слово ставим в начало, дальше — тот же порядок, что и в теме 4."),
        formula("вопр. слово", "!did", "кто", "глагол", "остальное", "?"),
        table(["Вопрос", "Перевод", "Возможный ответ"], [
          ["<mark>What did</mark> you do at the weekend?", "Что ты делал на выходных?", "I went to my parents'."],
          ["<mark>Where did</mark> you go?", "Куда ты ходил?", "To the cinema."],
          ["<mark>When did</mark> she call?", "Когда она звонила?", "Two hours ago."],
          ["<mark>Who did</mark> you meet?", "Кого ты встретил?", "My old friend."],
          ["<mark>How was</mark> your weekend?", "Как прошли выходные?", "It was great!"],
          ["<mark>Where were</mark> you?", "Где ты был?", "At work."],
        ]),
        p("Обратите внимание: если в вопросе есть <b>глагол-действие</b> — нужен <b>did</b>. Если спрашиваем «где был», «как было» — это to be, и нужен <b>was / were</b>."),
        h3("Как рассказать о выходных"),
        examples([
          ["В субботу я встретился с друзьями.", "On Saturday I <mark>met</mark> my friends."],
          ["Потом мы пошли в кафе.", "Then we <mark>went</mark> to a café."],
          ["Было здорово!", "It <mark>was</mark> great!"],
          ["В воскресенье я ничего не делал.", "On Sunday I <mark>didn't do</mark> anything."],
        ]),
        pit(
          `${no("Where you went?")} ${yes("Where did you go?")}`,
          `${no("What did you did?")} ${yes("What did you do?")}`,
          `${no("How did be your weekend?")} ${yes("How was your weekend?")}`
        ),
        link("Урок 6: Where do you live? · здесь тот же порядок, только do → did")
      ),
      groups: [
        group("Выберите правильный вопрос", [
          ch("«Куда ты ездил летом?»", ["Where did you go in the summer?", "Where you went in the summer?", "Where did you went in the summer?"], "Where did you go in the summer?", "Where + did + you + go."),
          ch("«Что ты ел на завтрак?»", ["What did you eat for breakfast?", "What did you ate for breakfast?", "What you eat for breakfast?"], "What did you eat for breakfast?", "После did — eat."),
          ch("«Как прошёл твой день?»", ["How was your day?", "How did your day?", "How were your day?"], "How was your day?", "day = it → was."),
          ch("«Где вы были вчера?»", ["Where were you yesterday?", "Where did you be yesterday?", "Where was you yesterday?"], "Where were you yesterday?", "you → were."),
        ]),
        group("Задайте вопрос к ответу", [
          inp("I went to the park.", ["Where did you go?"], "Where + did + you + go?", "Спросите: «Куда ты ходил?»"),
          inp("She called me at 9.", ["When did she call you?", "When did she call?"], "When + did + she + call you?", "Спросите: «Когда она тебе звонила?»"),
          inp("They met Anna.", ["Who did they meet?"], "Who + did + they + meet?", "Спросите: «Кого они встретили?»"),
          inp("It was very nice.", ["How was it?"], "С to be: How was it?", "Спросите: «Как это было?»"),
        ]),
        group("Соберите вопрос", [
          ord("What did you do at the weekend?", "What + did + you + do + at the weekend?"),
          ord("Where did she buy this dress?", "Where + did + she + buy + this dress?"),
          ord("How was the film?", "How + was + the film?"),
        ]),
      ],
    },
    {
      id: "final", nav: "Итоговый тест", eyebrow: "Итоговый тест · все темы вперемешку", title: "Проверьте себя",
      theory: p("Все темы урока вперемешку. Если ошибётесь, вернитесь к объяснению нужной темы через меню сверху."),
      groups: [
        group("Смешанные задания", [
          ch("We ___ at the seaside last July.", ["was", "were"], "were", "Тема 1: we → were."),
          ch("I ___ my grandmother on Saturday.", ["visit", "visited", "visiting"], "visited", "Тема 2: on Saturday в прошлом → visited."),
          inp("try →", ["tried"], "Тема 2: согласная + y → ied.", "Напишите форму прошедшего времени", "y меняется."),
          ch("He ___ a new car last month.", ["buyed", "bought", "buy"], "bought", "Тема 3: buy → bought."),
          inp("get →", ["got"], "Тема 3: get → got.", "Напишите форму прошедшего времени", "Три буквы."),
          ch("They ___ to the party.", ["didn't come", "didn't came", "weren't come"], "didn't come", "Тема 4: didn't + come."),
          inp("She ate all the cake.", ["She didn't eat all the cake.", "She did not eat all the cake."], "Тема 4: ate → didn't eat.", "Сделайте отрицание"),
          ch("Did you sleep well? — Yes, I ___.", ["did", "was", "slept"], "did", "Тема 4: Yes, I did."),
          ord("Where did you go last weekend?", "Тема 5: Where + did + you + go…?"),
          ch("«Как прошёл отпуск?»", ["How was your holiday?", "How did your holiday?", "How were your holiday?"], "How was your holiday?", "Тема 5: holiday = it → was."),
          ch("___ the weather good in Sochi?", ["Did", "Was", "Were"], "Was", "Тема 1: weather = it → Was."),
          inp("«Вчера я не работал.»", ["I didn't work yesterday.", "I did not work yesterday."], "Тема 4: didn't work.", "Переведите на английский"),
        ]),
      ],
    },
  ],
};

export default lesson;
