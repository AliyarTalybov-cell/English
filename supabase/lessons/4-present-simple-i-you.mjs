import { ch, inp, fix, ord, group, formula, table, examples, pit, no, yes, sticky, h3, p, compare, ng, html, extend } from "./_helpers.mjs";
import { addTranslation } from "./translate.mjs";

const lesson = {
  slug: "present-simple-i-you-we-they",
  title: "Present Simple: I, you, we, they",
  subtitle: "что я делаю обычно, don't и do, свободное время, always / never, at / on / in, дни и месяцы",
  position: 4,
  sections: [
    {
      id: "plus", nav: "I work", eyebrow: "Тема 1 · утверждение", title: "I work, we live — что мы делаем обычно",
      theory: html(
        h3("Сначала: какие бывают слова"),
        table(["Часть речи", "Вопрос", "Пример"], [
          ["глагол — verb (V)", "что делать?", "work, live, play"],
          ["существительное — noun", "кто? что?", "friend, book, weekend"],
          ["прилагательное — adjective", "какой?", "busy, free, interesting"],
          ["наречие — adverb", "как? как часто?", "often, never, well"],
        ]),
        p("Present Simple говорит о том, что происходит <b>обычно, регулярно</b> или <b>всегда правда</b>: привычки, распорядок, факты о себе."),
        formula("I · you · we · they", "!глагол", "остальное"),
        p("С I, you, we, they глагол берём <b>как в словаре</b>, ничего не добавляем."),
        examples([
          ["Я работаю из дома.", "I <mark>work</mark> from home.", "постоянно, это факт"],
          ["Мы ходим в кино каждую пятницу.", "We <mark>go</mark> to the cinema every Friday.", "регулярно"],
          ["Они живут в Берлине.", "They <mark>live</mark> in Berlin.", "факт"],
          ["Я много читаю.", "I <mark>read</mark> a lot of books.", "привычка"],
        ]),
        h3("to be или глагол-действие?"),
        p("Вспомните урок 1: сказуемое одно. Если есть глагол-действие, <b>am / is / are не нужны</b>."),
        compare(
          ["I am busy.", "Я занят.", "нет действия → am"],
          ["I work a lot.", "Я много работаю.", "есть действие work → без am"]
        ),
        pit(
          `Не ставьте am / are рядом с глаголом: ${no("I am work from home.")} ${yes("I work from home.")}`,
          `Не добавляйте -ing, если речь о привычке: ${no("I working every day.")} ${yes("I work every day.")}`
        ),
        sticky("Present Simple · I / you / we / they V (verb) · (+) I go / we want / they like / you take · I work from home")
      ),
      groups: [
        group("Нужен ли am / are? «—» значит «ничего не нужно»", [
          ch("I ___ live in Moscow.", ["am", "—"], "—", "live — глагол-действие, am не нужен."),
          ch("We ___ very busy at work.", ["are", "—"], "are", "busy — не действие, нужен are."),
          ch("They ___ play tennis on Sundays.", ["are", "—"], "—", "play — действие, are не нужен."),
          ch("I ___ tired in the evenings.", ["am", "—"], "am", "tired — состояние, нужен am."),
          ch("You ___ cook very well!", ["are", "—"], "—", "cook — действие."),
        ]),
        group("Какое предложение правильное?", [
          ch("«Я работаю в офисе.»", ["I work in an office.", "I am work in an office.", "I working in an office."], "I work in an office.", "Одно сказуемое — work.", { "I am work in an office.": "work уже сказуемое, am лишний.", "I working in an office.": "Для привычки -ing не нужен." }),
          ch("«Мы часто готовим пасту.»", ["We often cook pasta.", "We are often cook pasta.", "We often cooking pasta."], "We often cook pasta.", "Глагол в словарной форме: cook."),
          ch("«Мои друзья живут рядом.»", ["My friends live near me.", "My friends are live near me.", "My friends lives near me."], "My friends live near me.", "friends = they → live, без -s."),
        ]),
        group("Какая это часть речи?", [
          ch("weekend — это ___", ["noun", "verb", "adjective"], "noun", "weekend — выходные, отвечает на «что?» → noun."),
          ch("play — это ___", ["noun", "verb", "adverb"], "verb", "play — играть, «что делать?» → verb."),
          ch("busy — это ___", ["verb", "adjective", "adverb"], "adjective", "busy — занятой, «какой?» → adjective."),
          ch("often — это ___", ["noun", "adjective", "adverb"], "adverb", "often — часто, «как часто?» → adverb."),
        ]),
      ],
    },
    {
      id: "neg", nav: "don't · do", eyebrow: "Тема 2 · отрицание и вопрос", title: "I don't work. Do you work?",
      theory: html(
        h3("Отрицание: don't"),
        p("Ставим <b>don't</b> (= do not) перед глаголом. Сам глагол не меняется."),
        formula("I · you · we · they", "!don't", "глагол", "остальное"),
        examples([
          ["Я не смотрю телевизор.", "I <mark>don't watch</mark> TV."],
          ["У нас мало свободного времени.", "We <mark>don't have</mark> a lot of free time.", "дословно: у нас нет много времени"],
          ["Они не любят овощи.", "They <mark>don't like</mark> vegetables."],
        ]),
        h3("Вопрос: Do"),
        formula("!Do", "you · we · they", "глагол", "остальное", "?"),
        table(["Вопрос", "Да", "Нет"], [
          ["<mark>Do</mark> you like coffee?", "Yes, I do.", "No, I don't."],
          ["<mark>Do</mark> they live here?", "Yes, they do.", "No, they don't."],
        ]),
        p("В коротком ответе глагол не повторяем: <b>Yes, I do</b>, а не Yes, I like."),
        pit(
          `После don't — глагол, а не got: ${no("I don't got a car.")} ${yes("I don't have a car.")} ${yes("I haven't got a car.")}`,
          `Not без do не работает: ${no("I not like it.")} ${no("I no like it.")} ${yes("I don't like it.")}`,
          `В вопросе нужен Do: ${no("You like coffee?")} ${yes("Do you like coffee?")}`,
          `Не путайте с to be: ${no("Do you are tired?")} ${yes("Are you tired?")}`
        ),
        sticky("(−) we don't like · (?) Do you have? Do you want? · Yes, I do / No, I don't")
      ),
      groups: [
        group("Выберите правильную форму", [
          ch("I ___ coffee before bed.", ["don't drink", "not drink", "am not drink"], "don't drink", "Отрицание: don't + глагол."),
          ch("___ you play the guitar?", ["Do", "Are", "Have"], "Do", "Вопрос с глаголом play → Do."),
          ch("Do you live near here? — Yes, I ___.", ["do", "live", "am"], "do", "Короткий ответ: Yes, I do."),
          ch("Do they work on Saturdays? — No, they ___.", ["don't", "aren't", "not"], "don't", "Короткий ответ: No, they don't."),
          ch("We ___ a car.", ["don't have", "don't got", "not have"], "don't have", "don't + have. «don't got» не бывает."),
          ch("___ you tired?", ["Do", "Are"], "Are", "tired — не действие. Вопрос с to be: Are you tired?"),
        ]),
        group("Сделайте отрицание (как в домашнем задании)", [
          inp("I watch a lot of sport on TV.", ["I don't watch a lot of sport on TV.", "I do not watch a lot of sport on TV."], "watch → don't watch.", "Сделайте отрицание"),
          inp("We have a lot of free time at the weekend.", ["We don't have a lot of free time at the weekend.", "We do not have a lot of free time at the weekend."], "have → don't have.", "Сделайте отрицание"),
          inp("Our children like video games.", ["Our children don't like video games.", "Our children do not like video games."], "like → don't like.", "Сделайте отрицание"),
          inp("They often make pasta for dinner.", ["They don't often make pasta for dinner.", "They do not often make pasta for dinner."], "don't + often + make.", "Сделайте отрицание"),
        ]),
        group("Задайте вопрос", [
          inp("You play tennis.", ["Do you play tennis?"], "Do + you + play tennis?", "Превратите в вопрос"),
          inp("They live in London.", ["Do they live in London?"], "Do + they + live in London?", "Превратите в вопрос"),
          inp("You read the newspaper every day.", ["Do you read the newspaper every day?"], "Do + you + read…?", "Превратите в вопрос"),
        ]),
        group("Нажмите на неправильное слово", [
          fix("I not watch TV in the morning.", "not", "don't", "Отрицание — don't."),
          fix("We don't got a car.", "got", "have", "После don't — have."),
          fix("Are you like pizza?", "Are", "Do", "like — глагол-действие → Do you like…?"),
        ]),
      ],
    },
    {
      id: "free", nav: "Свободное время", eyebrow: "Тема 3 · лексика", title: "Что вы делаете в свободное время",
      theory: html(
        p("Слова из урока «Free time». Учите их <b>сочетаниями</b>: глагол + слово. По-русски «ходить гулять», а по-английски <b>go for</b> a walk."),
        ng(
          ["go", ["go online — выходить в интернет", "go for a walk — гулять", "go for a bike ride — кататься на велосипеде", "go for a coffee — сходить выпить кофе", "go to a concert — ходить на концерт", "go shopping — ходить по магазинам"]],
          ["meet · see", ["meet friends — встречаться с друзьями", "see friends — видеться с друзьями", "visit a museum — сходить в музей"]]
        ),
        ng(
          ["play · watch · read", ["play sport / football — заниматься спортом / играть в футбол", "watch TV / sport on TV — смотреть телевизор / спорт", "read books / a newspaper — читать книги / газету"]],
          ["cook · paint · ride", ["cook dinner — готовить ужин", "paint pictures — рисовать картины", "ride a bike / a horse / a motorbike — ездить на велосипеде / лошади / мотоцикле"]]
        ),
        h3("like + -ing — любить что-то делать"),
        p("После <b>like, love, hate</b> глагол обычно с <b>-ing</b>."),
        examples([
          ["Я люблю путешествовать.", "I like <mark>travelling</mark>.", "like + V-ing"],
          ["Я люблю играть в видеоигры.", "I like <mark>playing</mark> video games."],
          ["Мы ненавидим ходить по магазинам.", "We hate <mark>going</mark> shopping."],
        ]),
        h3("Другие полезные фразы"),
        examples([
          ["Я ничего не делаю.", "I do <mark>nothing</mark>.", "nothing уже значит «ничего» — don't не нужен"],
          ["Я занят работой.", "I'm <mark>busy with</mark> my work.", "to be busy with something"],
          ["У меня застой, ничего не хочется.", "I'm <mark>in a slump</mark>.", "in a slump — в упадке, в застое"],
          ["Понятно!", "I <mark>get it</mark>!", "get it — понять"],
        ]),
        pit(
          `Встречаться с друзьями — без with: ${no("I meet with friends.")} ${yes("I meet friends.")}`,
          `Два отрицания подряд не ставят: ${no("I don't do nothing.")} ${yes("I do nothing.")} ${yes("I don't do anything.")}`,
          `Гулять — go for a walk: ${no("I go to walk.")} ${yes("I go for a walk.")}`
        ),
        sticky("to ride a bike / a horse / a motorbike · go for a walk / a ride · to be busy with something · go to a concert · in a slump · I get it · like + V-ing: I like traveling · I do nothing")
      ),
      groups: [
        group("Выберите глагол", [
          ch("I ___ online every evening.", ["go", "play", "do"], "go", "go online."),
          ch("We ___ friends on Saturdays.", ["meet", "watch", "go"], "meet", "meet friends — без with."),
          ch("They ___ sport on TV.", ["watch", "see", "play"], "watch", "watch sport on TV."),
          ch("My mum ___ pictures in her free time.", ["paints", "plays", "does"], "paints", "paint pictures."),
          ch("Let's ___ for a coffee!", ["go", "do", "have"], "go", "go for a coffee."),
          ch("I ___ a museum once a month.", ["visit", "go", "meet"], "visit", "visit a museum. Можно и go to a museum."),
          ch("Do you ___ a bike?", ["ride", "drive", "go"], "ride", "ride a bike."),
        ]),
        group("Выберите правильный вариант", [
          ch("I like ___ to music.", ["listen", "listening", "to listen"], "listening", "like + V-ing: I like listening to music.", { listen: "После like — listening." }),
          ch("«Я гуляю каждый день.»", ["I go for a walk every day.", "I go to walk every day.", "I walk go every day."], "I go for a walk every day.", "go for a walk."),
          ch("«Я встречаюсь с друзьями.»", ["I meet friends.", "I meet with friends.", "I am meet friends."], "I meet friends.", "meet friends — без with."),
          ch("«По выходным я ничего не делаю.»", ["I do nothing at the weekend.", "I don't do nothing at the weekend.", "I am nothing at the weekend."], "I do nothing at the weekend.", "nothing уже отрицание."),
        ]),
      ],
    },
    {
      id: "often", nav: "always · never", eyebrow: "Тема 4 · как часто", title: "always, usually, often, sometimes, never",
      theory: html(
        p("Эти слова говорят, <b>как часто</b> что-то происходит."),
        table(["Слово", "Значение", "Как часто"], [
          ["<mark>always</mark>", "всегда", "100%"],
          ["<mark>usually</mark>", "обычно", "≈ 90%"],
          ["<mark>often</mark>", "часто", "≈ 70%"],
          ["<mark>sometimes</mark>", "иногда", "≈ 50%"],
          ["<mark>rarely</mark>", "редко", "≈ 10%"],
          ["<mark>hardly ever</mark>", "почти никогда", "≈ 5%"],
          ["<mark>never</mark>", "никогда", "0%"],
        ]),
        h3("Куда ставить"),
        table(["Правило", "Пример"], [
          ["<b>перед</b> глаголом-действием", "I <mark>usually</mark> eat at home."],
          ["<b>после</b> am / is / are", "I'm <mark>always</mark> busy."],
          ["<b>после</b> don't", "We don't <mark>often</mark> eat pizza."],
          ["sometimes можно и в начале", "<mark>Sometimes</mark> my mum cooks for us."],
        ]),
        examples([
          ["Я редко смотрю телевизор днём.", "I <mark>rarely</mark> watch TV in the afternoon."],
          ["Я почти никогда не сижу в интернете вечером.", "I <mark>hardly ever</mark> go online in the evenings."],
          ["Я никогда не пью кофе перед сном.", "I <mark>never</mark> drink coffee before bed."],
        ]),
        pit(
          `never, rarely, hardly ever уже отрицательные — don't не нужен: ${no("I don't never go out.")} ${yes("I never go out.")}`,
          `Слово частоты — перед глаголом, но после don't: ${no("I usually don't enjoy films.")} ${yes("I don't usually enjoy films.")}`,
          `Не разрывайте сочетание: ${no("They go every day for a walk.")} ${yes("They go for a walk every day.")}`
        ),
        sticky("I rarely meet with friends · I don't usually eat… · we rarely watch sport on TV · I hardly ever go online in the evenings")
      ),
      groups: [
        group("Выберите слово", [
          ch("I drink coffee every morning. I ___ drink coffee in the morning.", ["always", "sometimes", "never"], "always", "Каждое утро → always."),
          ch("I don't like fish. I ___ eat it.", ["often", "usually", "never"], "never", "Не люблю → никогда не ем: never."),
          ch("We go to the cinema two or three times a year. We ___ go to the cinema.", ["always", "rarely", "usually"], "rarely", "Два-три раза в год — редко: rarely."),
          ch("She goes to the gym five days a week. She ___ goes to the gym.", ["usually", "hardly ever", "never"], "usually", "Почти каждый день → usually."),
        ]),
        group("Где стоит слово? Выберите правильное предложение", [
          ch("(always)", ["I'm always busy.", "I always am busy.", "Always I'm busy."], "I'm always busy.", "После am → I'm always busy."),
          ch("(usually)", ["I usually get up at 7.", "I get up usually at 7.", "I get usually up at 7."], "I usually get up at 7.", "Перед глаголом-действием."),
          ch("(often)", ["We don't often eat out.", "We often don't eat out.", "We don't eat often out."], "We don't often eat out.", "После don't: don't often."),
          ch("(never)", ["I never go online in the morning.", "I don't never go online in the morning.", "I go never online in the morning."], "I never go online in the morning.", "never перед глаголом, без don't."),
        ]),
        group("Соберите предложение (как в домашнем задании)", [
          ord("I often go out at the weekend.", "I + often + go out + at the weekend."),
          ord("We rarely watch sport on TV.", "We + rarely + watch + sport on TV."),
          ord("You sometimes cook dinner.", "You + sometimes + cook + dinner.", ["Sometimes you cook dinner."]),
          ord("They go for a walk every day.", "They + go for a walk + every day (в конце)."),
          ord("I hardly ever go online in the evenings.", "I + hardly ever + go online + in the evenings."),
          ord("I never drink coffee before bed.", "I + never + drink coffee + before bed."),
        ]),
        group("Какое предложение правильное?", [
          ch("«Я никогда не ем мясо.»", ["I never eat meat.", "I don't never eat meat.", "I never don't eat meat."], "I never eat meat.", "never уже значит «никогда», don't не нужен."),
          ch("«У тебя всегда пицца!»", ["You always have pizza!", "You have always pizza!", "Always you have pizza!"], "You always have pizza!", "Слово частоты — перед глаголом have."),
          ch("«После работы я обычно устаю.»", ["I'm usually tired after work.", "I usually am tired after work.", "I'm tired usually after work."], "I'm usually tired after work.", "После am: I'm usually tired."),
        ]),
      ],
    },
    {
      id: "time", nav: "at · on · in", eyebrow: "Тема 5 · время", title: "Когда? at, on, in, every, once a week",
      theory: html(
        h3("at, on, in — предлоги времени"),
        table(["Предлог", "Когда", "Примеры"], [
          ["<mark>at</mark>", "точное время, выходные, ночь", "at 5 a.m. · at six o'clock · at night · at the weekend"],
          ["<mark>on</mark>", "день недели, дата", "on Monday · on Friday mornings · on 12 May"],
          ["<mark>in</mark>", "месяц, год, время года, часть дня", "in June · in 2020 · in summer · in the morning · in the evening"],
        ]),
        p("Запомнить помогает пирамида: чем меньше отрезок времени, тем «острее» предлог. <b>in</b> — большие отрезки, <b>on</b> — день, <b>at</b> — точка."),
        pit(
          `Но: in the morning / in the evening, а ночью — ${yes("at night")}`,
          `Перед every, next, last предлог не ставят: ${no("on every Monday")} ${yes("every Monday")}`
        ),
        h3("Как часто: every, once, twice"),
        table(["Выражение", "Значение"], [
          ["every day / week / month / year", "каждый день / неделю / месяц / год"],
          ["every morning / night", "каждое утро / каждую ночь"],
          ["<mark>once</mark> a week", "раз в неделю"],
          ["<mark>twice</mark> a month", "два раза в месяц"],
          ["<mark>three times</mark> a week", "три раза в неделю"],
        ]),
        p("Эти выражения обычно ставят <b>в конец</b> предложения: I go to the gym <b>three times a week</b>."),
        h3("a.m. и p.m."),
        p("<b>a.m.</b> — с полуночи до полудня (00–12), <b>p.m.</b> — с полудня до полуночи (12–00). 7 a.m. — 7 утра, 7 p.m. — 7 вечера."),
        h3("Дни недели и месяцы — всегда с большой буквы"),
        ng(
          ["Days", ["Monday — понедельник", "Tuesday — вторник", "Wednesday — среда", "Thursday — четверг", "Friday — пятница", "Saturday — суббота", "Sunday — воскресенье"]],
          ["Months", ["January · February · March", "April · May · June", "July · August · September", "October · November · December"]]
        ),
        pit(`С большой буквы: ${no("on monday, in april")} ${yes("on Monday, in April")}`),
        sticky("at night / every night / every day · on + day · in + year / month / season · at 5 am · 3 times a week · am (00–12) / pm (12–00) · January … December · I run every morning")
      ),
      groups: [
        group("at, on или in?", [
          ch("I get up ___ 7 o'clock.", ["at", "on", "in"], "at", "Точное время → at."),
          ch("We go to the gym ___ Tuesdays and Thursdays.", ["at", "on", "in"], "on", "Дни недели → on."),
          ch("My birthday is ___ June.", ["at", "on", "in"], "in", "Месяц → in."),
          ch("I don't work ___ the weekend.", ["at", "on", "in"], "at", "at the weekend (брит.)."),
          ch("I read ___ the evening.", ["at", "on", "in"], "in", "in the evening."),
          ch("I never drink coffee ___ night.", ["at", "on", "in"], "at", "at night — исключение."),
          ch("They go to the sea ___ summer.", ["at", "on", "in"], "in", "Время года → in."),
          ch("We have pizza ___ Friday evenings.", ["at", "on", "in"], "on", "День недели + часть дня → on Friday evenings."),
        ]),
        group("Выберите правильный вариант", [
          ch("«Я хожу в спортзал три раза в неделю.»", ["I go to the gym three times a week.", "I go to the gym three times in week.", "I three times go to the gym a week."], "I go to the gym three times a week.", "three times a week — в конце."),
          ch("«Мы встречаемся раз в месяц.»", ["We meet once a month.", "We meet one time in month.", "We once meet a month."], "We meet once a month.", "раз в месяц = once a month."),
          ch("«Я бегаю каждое утро.»", ["I run every morning.", "I run in every morning.", "I run every mornings."], "I run every morning.", "Перед every предлог не нужен, morning — без -s."),
          ch("3 p.m. — это ___", ["3 часа дня", "3 часа ночи"], "3 часа дня", "p.m. — после полудня."),
        ]),
        group("Напишите по-английски", [
          inp("понедельник →", ["Monday"], "Monday — с большой буквы.", "Напишите день недели", "Начинается на M."),
          inp("среда →", ["Wednesday"], "Wednesday — в середине «d», читается «венздей».", "Напишите день недели", "Wed…"),
          inp("август →", ["August"], "August — с большой буквы.", "Напишите месяц", "Начинается на A."),
          inp("февраль →", ["February"], "February — не забудьте r после b.", "Напишите месяц", "Feb…"),
        ]),
      ],
    },
    {
      id: "final", nav: "Итоговый тест", eyebrow: "Итоговый тест · все темы вперемешку", title: "Проверьте себя",
      theory: p("Все темы урока вперемешку. Если ошибётесь, вернитесь к объяснению нужной темы через меню сверху."),
      groups: [
        group("Смешанные задания", [
          ch("I ___ from home on Fridays.", ["work", "am work", "working"], "work", "Тема 1: одно сказуемое — work."),
          inp("We go out on Saturdays.", ["We don't go out on Saturdays.", "We do not go out on Saturdays."], "Тема 2: go → don't go.", "Сделайте отрицание"),
          ch("Do you like jazz? — No, I ___.", ["don't", "not", "am not"], "don't", "Тема 2: No, I don't."),
          ch("I often ___ for a bike ride.", ["go", "do", "play"], "go", "Тема 3: go for a bike ride."),
          ord("I usually have breakfast at home.", "Тема 4: usually — перед глаголом."),
          ch("«Я никогда не хожу в театр.»", ["I never go to the theatre.", "I don't never go to the theatre."], "I never go to the theatre.", "Тема 4: never без don't."),
          ch("My English classes are ___ Mondays.", ["at", "on", "in"], "on", "Тема 5: дни недели → on."),
          ch("I like ___ books.", ["read", "reading", "reads"], "reading", "Тема 3: like + V-ing."),
          inp("they / live / in Spain?", ["Do they live in Spain?"], "Тема 2: Do + they + live…?", "Составьте вопрос"),
          ch("I meet my grandma ___ Saturday.", ["every", "in every", "on every"], "every", "Тема 5: перед every предлог не нужен."),
          ch("We visit my parents ___ a month.", ["once", "one", "one time in"], "once", "Тема 5: once a month."),
          ord("I don't usually watch TV in the evening.", "Тема 4: don't + usually + watch."),
        ]),
      ],
    },
  ],
};

// Added after a second check of the board: the student's answers about free time from «Free time».
extend(lesson, "free", html(
  h3("Ваши ответы про свободное время"),
  examples([
    ["Я езжу на машине.", "I drive my car.", "drive — водить машину; ride — велосипед, мотоцикл"],
    ["Я гуляю по городу.", "I walk <mark>around</mark> the city.", "по городу — around the city"],
    ["Люди ходят в рестораны и гуляют с детьми.", "People go to restaurants and <mark>go for walks</mark> with their children.", "с кем-то — with"],
    ["Мы собираемся прочитать статью.", "We're going to read the <mark>article</mark>.", "article — статья, heading — заголовок"],
    ["Я ем овсянку на завтрак.", "I have <mark>oatmeal</mark> for breakfast.", "oatmeal (амер.) = porridge (брит.)"],
  ]),
  pit(
    `Машину водят, а не «ездят на ней»: ${no("I ride my car.")} ${yes("I drive my car.")}`,
    `${no("I walk in the city.")} — звучит как «хожу внутри города». Лучше ${yes("I walk around the city.")}`
  ),
  sticky("I drive my car / I walk in the city / I watch TV · People go to restaurants and walk with their children · we are going to read the article · heading · oatmeal")
), group("Ваши фразы", [
  ch("«Я вожу машину каждый день.»", ["I drive my car every day.", "I ride my car every day.", "I go my car every day."], "I drive my car every day.", "Машину — drive."),
  ch("«По выходным мы гуляем по городу.»", ["We walk around the city at the weekend.", "We walk in city at the weekend.", "We go walk the city at the weekend."], "We walk around the city at the weekend.", "по городу — around the city."),
  ch("Read the ___ of the article first. It tells you what it's about.", ["heading", "weekend", "oatmeal"], "heading", "heading — заголовок."),
  ch("«Я ем кашу на завтрак.»", ["I have porridge for breakfast.", "I do porridge for breakfast.", "I have porridge on breakfast."], "I have porridge for breakfast.", "have … for breakfast."),
]));

// «Переведите с русского» goes last in every topic; add new groups below this line so item ids stay the same.
addTranslation(lesson);

export default lesson;
