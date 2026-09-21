import { ch, inp, fix, ord, group, formula, table, examples, pit, no, yes, sticky, h3, p, compare, ng, html, extend } from "./_helpers.mjs";

const link = text => sticky(text, "Связь с курсом");

const lesson = {
  slug: "pronouns-articles",
  title: "me, him, them и артикли a / the",
  subtitle: "местоимения после глагола, a / an / the, множественное число, I like it",
  position: 11,
  sections: [
    {
      id: "obj", nav: "me · him · them", eyebrow: "Тема 1 · местоимения", title: "Call me. I know him.",
      theory: html(
        p("В уроке 2 были слова «чей»: my, mine. Теперь — местоимения, которые стоят <b>после глагола</b> или после предлога: «позвони <b>мне</b>», «я знаю <b>его</b>»."),
        table(["Кто делает", "Кого / кому", "Пример"], [
          ["I", "<mark>me</mark> — меня, мне", "Call me."],
          ["you", "<mark>you</mark> — тебя, вас", "I can help you."],
          ["he", "<mark>him</mark> — его, ему", "I know him."],
          ["she", "<mark>her</mark> — её, ей", "Give her the book."],
          ["it", "<mark>it</mark> — его, её (о предмете)", "I like it."],
          ["we", "<mark>us</mark> — нас, нам", "Come with us."],
          ["they", "<mark>them</mark> — их, им", "I often see them."],
        ]),
        compare(
          ["He knows my sister.", "Он знает мою сестру.", "he — кто делает"],
          ["My sister knows him.", "Моя сестра знает его.", "him — кого знает"]
        ),
        examples([
          ["Позвони мне вечером.", "Call <mark>me</mark> in the evening."],
          ["Я люблю их, они хорошие друзья.", "I love <mark>them</mark>, they're good friends."],
          ["Этот фильм? Я его не видел.", "This film? I didn't see <mark>it</mark>.", "о предмете — it"],
          ["Пойдём с нами!", "Come with <mark>us</mark>!", "после предлога — us"],
        ]),
        pit(
          `После глагола — не he / she: ${no("I know he.")} ${yes("I know him.")}`,
          `${no("Give the book to she.")} ${yes("Give the book to her.")}`,
          `her бывает и «её» перед предметом: her bag — её сумка, I see her — я вижу её.`
        ),
        link("Урок 2, темы 3 и 4: my / mine · Урок 5: he works — а здесь he превращается в him")
      ),
      groups: [
        group("Выберите местоимение", [
          ch("I saw Tom yesterday. I know ___ well.", ["he", "him", "his"], "him", "После глагола → him."),
          ch("Anna is my friend. I often call ___.", ["she", "her", "hers"], "her", "После глагола → her."),
          ch("These are my keys. Can you give ___ to me?", ["they", "them", "their"], "them", "keys → them."),
          ch("We're at home. Come and visit ___!", ["we", "us", "our"], "us", "После глагола → us."),
          ch("This song is great. I love ___.", ["it", "its", "him"], "it", "О предмете → it."),
          ch("Can you help ___? I don't understand this task.", ["I", "me", "my"], "me", "После глагола → me."),
        ]),
        group("Замените слова на местоимение", [
          inp("I know Tom and Jack. → I know ___.", ["them"], "Tom and Jack → them.", "Впишите одно слово", "Они — …"),
          inp("She loves this city. → She loves ___.", ["it"], "city → it.", "Впишите одно слово", "Предмет — …"),
          inp("He often calls Maria. → He often calls ___.", ["her"], "Maria → her.", "Впишите одно слово", "Она — …"),
        ]),
        group("Нажмите на неправильное слово", [
          fix("I don't know she.", "she", "her", "После глагола → her."),
          fix("Can you call I tomorrow?", "I", "me", "После глагола → me."),
          fix("We saw they at the party.", "they", "them", "После глагола → them."),
        ]),
      ],
    },
    {
      id: "art", nav: "a · an · the", eyebrow: "Тема 2 · артикли", title: "a, an, the или ничего",
      theory: html(
        p("Артикли — маленькие слова перед предметом. В русском их нет, поэтому их легко забыть. Правило простое и его хватает на весь A1."),
        table(["Что ставим", "Когда", "Пример"], [
          ["<mark>a / an</mark>", "предмет один и мы говорим о нём <b>впервые</b>", "I have a car."],
          ["<mark>the</mark>", "предмет уже известен или он один такой", "The car is black."],
          ["ничего", "много предметов вообще, или общее понятие", "I like cats. · Coffee is expensive."],
        ]),
        h3("a или an"),
        p("<b>an</b> — перед гласным звуком: an apple, an hour, an engineer. <b>a</b> — перед согласным: a book, a university («юниверсити» начинается со звука «й»)."),
        h3("Как это работает в разговоре"),
        examples([
          ["Я купил машину. Машина красная.", "I bought <mark>a</mark> car. <mark>The</mark> car is red.", "сначала a, потом the"],
          ["Она врач.", "She's <mark>a</mark> doctor.", "профессия — всегда с a"],
          ["Закрой дверь, пожалуйста.", "Close <mark>the</mark> door, please.", "дверь здесь одна, понятно какая"],
          ["Я люблю собак.", "I like dogs.", "вообще все собаки — без артикля"],
          ["Солнце светит.", "<mark>The</mark> sun is shining.", "солнце одно"],
        ]),
        h3("Устойчивые случаи"),
        table(["С the", "Без артикля"], [
          ["the cinema, the theatre, the gym", "home, work, school, bed"],
          ["the same", "breakfast, lunch, dinner"],
          ["the left, the right", "Monday, May, English, Russia"],
        ]),
        pit(
          `Профессия — с артиклем: ${no("I'm teacher.")} ${yes("I'm a teacher.")}`,
          `${no("I go to the home.")} ${yes("I go home.")}`,
          `${no("I like the cats.")} — это «те самые кошки». Вообще про кошек: ${yes("I like cats.")}`
        ),
        link("Урок 5, тема 4: a перед профессией · Урок 5, тема 3: go home без предлога")
      ),
      groups: [
        group("a, an, the или ничего? («—» значит «ничего»)", [
          ch("I have ___ dog. ___ dog is very friendly.", ["a / The", "the / A", "an / The"], "a / The", "Сначала a (впервые), потом The (уже известна)."),
          ch("My father is ___ engineer.", ["a", "an", "—"], "an", "engineer начинается с гласного звука → an."),
          ch("Can you open ___ window, please?", ["a", "the", "—"], "the", "Понятно, какое окно → the."),
          ch("I don't like ___ horror films.", ["a", "the", "—"], "—", "Вообще все фильмы ужасов → без артикля."),
          ch("She goes to ___ gym twice a week.", ["a", "the", "—"], "the", "go to the gym — устойчивое."),
          ch("We have ___ breakfast at 8.", ["a", "the", "—"], "—", "have breakfast — без артикля."),
          ch("He works in ___ bank in the centre.", ["a", "the", "—"], "a", "Впервые упоминаем банк → a."),
          ch("I'm at ___ home today.", ["a", "the", "—"], "—", "at home — без артикля."),
        ]),
        group("Нажмите на неправильное слово", [
          fix("My sister is teacher.", "teacher", "a teacher", "Перед профессией — a."),
          ch("«Я ложусь спать в одиннадцать.»", ["I go to bed at eleven.", "I go to the bed at eleven.", "I go to a bed at eleven."], "I go to bed at eleven.", "go to bed — без артикля."),
          fix("She is an doctor.", "an", "a", "doctor начинается с согласного → a."),
        ]),
      ],
    },
    {
      id: "plural", nav: "Множественное число", eyebrow: "Тема 3 · один и много", title: "cats, boxes, children",
      theory: html(
        table(["Слово кончается на…", "Что делаем", "Примеры"], [
          ["обычный случай", "+ <mark>s</mark>", "cat → cats · book → books"],
          ["-s, -x, -ch, -sh, -o", "+ <mark>es</mark>", "box → boxes · watch → watches · potato → potatoes"],
          ["согласная + y", "y → <mark>ies</mark>", "city → cities · country → countries"],
          ["-f, -fe", "f → <mark>ves</mark>", "knife → knives · wife → wives"],
        ]),
        p("Правила те же, что для окончания -s у глаголов в уроке 5. Но есть слова, которые меняются полностью — их надо запомнить."),
        table(["Один", "Много"], [
          ["a child — ребёнок", "<mark>children</mark>"],
          ["a person — человек", "<mark>people</mark>"],
          ["a man — мужчина", "<mark>men</mark>"],
          ["a woman — женщина", "<mark>women</mark>"],
          ["a foot — нога", "<mark>feet</mark>"],
          ["a tooth — зуб", "<mark>teeth</mark>"],
        ]),
        p("<b>people</b>, <b>children</b> — это уже «много», поэтому с ними идёт <b>are</b> и <b>there are</b>: There are a lot of people here."),
        examples([
          ["В парке двое детей.", "There are two <mark>children</mark> in the park."],
          ["В комнате много людей.", "There are a lot of <mark>people</mark> in the room.", "не peoples"],
          ["Я чищу зубы дважды в день.", "I brush my <mark>teeth</mark> twice a day."],
        ]),
        pit(
          `${no("two childs")} ${no("peoples")} ${yes("two children")} ${yes("people")}`,
          `Слова во множественном числе — это «они»: ${no("People is nice here.")} ${yes("People are nice here.")}`
        ),
        link("Урок 5, тема 1: правила -s / -es у глаголов · Урок 2: gloves, earrings — вещи только во множественном")
      ),
      groups: [
        group("Напишите множественное число", [
          inp("box →", ["boxes"], "x → es.", "Напишите множественное число", "Кончается на x."),
          inp("city →", ["cities"], "согласная + y → ies.", "Напишите множественное число", "y меняется."),
          inp("child →", ["children"], "Особая форма.", "Напишите множественное число", "Не childs."),
          inp("person →", ["people"], "Особая форма.", "Напишите множественное число", "Не persons."),
          inp("knife →", ["knives"], "f → ves.", "Напишите множественное число", "Кончается на -ves."),
          inp("woman →", ["women"], "Особая форма.", "Напишите множественное число", "Меняется гласная."),
        ]),
        group("Выберите правильный вариант", [
          ch("There are three ___ in the photo.", ["childs", "children", "childrens"], "children", "child → children."),
          ch("A lot of ___ work in this office.", ["people", "peoples", "persons"], "people", "people — уже множественное."),
          ch("How many ___ are there in your country?", ["citys", "cities", "cityes"], "cities", "city → cities."),
          ch("People ___ very friendly here.", ["is", "are"], "are", "people = they → are."),
        ]),
      ],
    },
    {
      id: "like", nav: "I like it", eyebrow: "Тема 4 · нравится", title: "like, love, hate + it и + -ing",
      theory: html(
        p("В уроке 4 было <b>like + -ing</b>: I like travelling. Теперь добавим местоимения: после like, love, hate может стоять и предмет, и человек, и целое занятие."),
        table(["Что после", "Пример", "Перевод"], [
          ["предмет / человек", "I like <mark>this song</mark>. · I like <mark>him</mark>.", "мне нравится песня / он"],
          ["занятие с -ing", "I like <mark>cooking</mark>.", "я люблю готовить"],
          ["очень", "I <mark>really</mark> like it. · I love it.", "очень нравится"],
          ["не нравится", "I <mark>don't like</mark> it. · I <mark>hate</mark> it.", "не нравится / ненавижу"],
        ]),
        examples([
          ["Мне нравится эта книга.", "I like <mark>this book</mark>."],
          ["Мне она очень нравится.", "I really like <mark>it</mark>.", "книга — it"],
          ["Он не любит рано вставать.", "He doesn't like <mark>getting</mark> up early.", "после like — getting"],
          ["Они обожают путешествовать.", "They love <mark>travelling</mark>."],
        ]),
        h3("Как ответить на «нравится?»"),
        table(["Вопрос", "Ответ"], [
          ["Do you like it?", "Yes, I do. / No, I don't."],
          ["Do you like cooking?", "Yes, I love it! / Not really."],
        ]),
        pit(
          `После like нужен объект: ${no("I like very much.")} ${yes("I like it very much.")}`,
          `Не путайте порядок: ${no("I like very much this film.")} ${yes("I like this film very much.")}`,
          `${no("I like to getting up early.")} ${yes("I like getting up early.")}`
        ),
        link("Урок 4, тема 3: like + -ing · Урок 6: Do you like…? и короткие ответы")
      ),
      groups: [
        group("Выберите правильный вариант", [
          ch("This is my favourite song. I love ___.", ["it", "its", "him"], "it", "Песня → it."),
          ch("I like ___ in the evening.", ["read", "reading", "to reading"], "reading", "like + -ing."),
          ch("She doesn't like ___ up early.", ["get", "getting", "gets"], "getting", "like + getting."),
          ch("Do you like this film? — Yes, I ___.", ["do", "like", "am"], "do", "Короткий ответ: Yes, I do."),
          ch("«Мне очень нравится этот город.»", ["I like this city very much.", "I like very much this city.", "I very like this city."], "I like this city very much.", "very much — в конце."),
        ]),
        group("Составьте предложение", [
          inp("(I / love / cook)", ["I love cooking."], "love + cooking.", "Составьте предложение"),
          inp("(they / not like / get up early)", ["They don't like getting up early.", "They do not like getting up early."], "don't like + getting up early.", "Составьте предложение"),
          inp("«Мне нравятся эти туфли.» (используйте them во втором предложении)", ["I like these shoes. I really like them.", "I like these shoes. I like them."], "shoes → them.", "Переведите на английский"),
        ]),
      ],
    },
    {
      id: "final", nav: "Итоговый тест", eyebrow: "Итоговый тест · все темы вперемешку", title: "Проверьте себя",
      theory: p("Все темы урока вперемешку. Если ошибётесь, вернитесь к объяснению нужной темы через меню сверху."),
      groups: [
        group("Смешанные задания", [
          ch("I saw Anna and Max yesterday. I know ___ well.", ["they", "them", "their"], "them", "Тема 1: после глагола → them."),
          ch("Can you call ___ at six?", ["I", "me", "my"], "me", "Тема 1: после глагола → me."),
          ch("My mother is ___ nurse.", ["a", "an", "—"], "a", "Тема 2: перед профессией — a."),
          ch("Close ___ door, please.", ["a", "the", "—"], "the", "Тема 2: понятно какая дверь → the."),
          ch("I don't like ___ cold weather.", ["a", "the", "—"], "—", "Тема 2: вообще → без артикля."),
          inp("tooth →", ["teeth"], "Тема 3: особая форма.", "Напишите множественное число", "Не tooths."),
          ch("There are five ___ in our team.", ["persons", "people", "peoples"], "people", "Тема 3: people."),
          ch("She likes ___ to music in the car.", ["listen", "listening", "listens"], "listening", "Тема 4: like + -ing."),
          fix("I know he very well.", "he", "him", "Тема 1: после глагола → him."),
          fix("My brother is engineer.", "engineer", "an engineer", "Тема 2: перед профессией — an."),
          ord("I really like this song.", "Тема 4: I + really like + this song."),
          inp("«Дети дома.»", ["The children are at home.", "Children are at home."], "Тема 3: children → are.", "Переведите на английский"),
        ]),
      ],
    },
  ],
};

extend(lesson, "art", null, group("Переведите на английский", [
  inp("«Он врач.»", ["He's a doctor.", "He is a doctor."], "Перед профессией — a.", "Переведите на английский"),
  inp("«Я люблю кофе.»", ["I like coffee.", "I love coffee."], "Вообще → без артикля.", "Переведите на английский"),
  inp("«Закрой окно, пожалуйста.»", ["Close the window, please."], "Понятно какое → the.", "Переведите на английский"),
]));
extend(lesson, "like", null, group("Выберите правильный вариант", [
  ch("My son hates ___ up early.", ["get", "getting", "gets"], "getting", "hate + -ing."),
  ch("Do you like your new job? — Yes, I ___ it.", ["love", "am loving", "like very"], "love", "love it — очень нравится."),
  ch("«Мне не нравятся эти туфли.»", ["I don't like these shoes.", "I don't like this shoes.", "I am not like these shoes."], "I don't like these shoes.", "don't like + these shoes."),
  ch("She likes ___ very much.", ["it", "him it", "them very"], "it", "like it very much."),
]));

export default lesson;
