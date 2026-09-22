import { ch, inp, fix, ord, group, formula, table, examples, pit, no, yes, sticky, h3, p, compare, ng, html, extend } from "./_helpers.mjs";
import { addTranslation } from "./translate.mjs";

const link = text => sticky(text, "Связь с курсом");

const lesson = {
  slug: "can",
  title: "can и can't: умею, могу, можно",
  subtitle: "умения, вопросы и короткие ответы, просьбы Can you…?, разрешения Can I…?",
  position: 10,
  sections: [
    {
      id: "able", nav: "I can swim", eyebrow: "Тема 1 · умения", title: "can — умею, могу",
      theory: html(
        p("<b>can</b> — «умею, могу». После него глагол стоит в начальной форме, безо всяких окончаний, и форма одинаковая для всех."),
        formula("кто", "!can", "глагол", "остальное"),
        table(["Кто", "Форма", "Пример"], [
          ["I / you / we / they", "<mark>can</mark>", "I can swim."],
          ["he / she / it", "<mark>can</mark> — тоже без -s", "She can drive."],
        ]),
        examples([
          ["Я умею плавать.", "I <mark>can swim</mark>."],
          ["Она говорит на трёх языках.", "She <mark>can speak</mark> three languages.", "не can speaks"],
          ["Мы можем встретиться завтра.", "We <mark>can meet</mark> tomorrow.", "can — не только умение, но и возможность"],
        ]),
        h3("Как сказать, насколько хорошо"),
        table(["Фраза", "Значение", "Пример"], [
          ["very well", "очень хорошо", "He can cook very well."],
          ["quite well", "довольно хорошо", "I can swim quite well."],
          ["a little / a bit", "немного", "She can speak French a little."],
          ["not … at all", "совсем не", "I can't dance at all."],
        ]),
        h3("Что обычно умеют"),
        ng(
          ["Глаголы умений", ["swim — плавать", "drive — водить машину", "cook — готовить", "dance — танцевать", "sing — петь", "draw — рисовать"]],
          ["И ещё", ["play the piano / the guitar — играть на пианино, гитаре", "speak English — говорить по-английски", "ride a bike — кататься на велосипеде", "ski — кататься на лыжах"]]
        ),
        pit(
          `После can глагол без -s и без to: ${no("She can drives.")} ${no("I can to swim.")} ${yes("She can drive.")} ${yes("I can swim.")}`,
          `«Я умею» — это can, а не know: ${no("I know to swim.")} ${yes("I can swim.")}`
        ),
        link("Урок 5: -s только у обычных глаголов · Урок 6: play the piano, ride a bike")
      ),
      groups: [
        group("Выберите правильную форму", [
          ch("She ___ very well.", ["can cook", "can cooks", "cans cook"], "can cook", "После can — cook, без -s."),
          ch("I ___ the guitar.", ["can play", "can to play", "can playing"], "can play", "can + play."),
          ch("My brother ___ a car.", ["can drive", "can drives", "can driving"], "can drive", "can + drive."),
          ch("«Я немного говорю по-английски.»", ["I can speak English a little.", "I can speak a little English very.", "I know speak English."], "I can speak English a little.", "a little — немного."),
          ch("«Я совсем не умею танцевать.»", ["I can't dance at all.", "I can't at all dance.", "I don't can dance."], "I can't dance at all.", "not … at all — совсем не."),
        ]),
        group("Составьте предложение", [
          inp("(I / swim)", ["I can swim."], "I + can + swim.", "Напишите, что вы умеете"),
          inp("(she / ride a bike)", ["She can ride a bike."], "She + can + ride a bike.", "Напишите, что она умеет"),
          inp("(they / speak Spanish)", ["They can speak Spanish."], "They + can + speak Spanish.", "Напишите, что они умеют"),
        ]),
      ],
    },
    {
      id: "cant", nav: "can't", eyebrow: "Тема 2 · отрицание и вопрос", title: "can't и Can you…?",
      theory: html(
        p("Отрицание — <b>can't</b> (полная форма cannot). Вопрос — <b>Can</b> в начале. Никаких do и does здесь не нужно."),
        formula("кто", "!can't", "глагол", "остальное"),
        formula("!Can", "кто", "глагол", "остальное", "?"),
        table(["Вопрос", "Да", "Нет"], [
          ["<mark>Can</mark> you swim?", "Yes, I can.", "No, I can't."],
          ["<mark>Can</mark> she drive?", "Yes, she can.", "No, she can't."],
        ]),
        examples([
          ["Я не умею кататься на лыжах.", "I <mark>can't</mark> ski."],
          ["Он не может прийти сегодня.", "He <mark>can't</mark> come today."],
          ["Ты умеешь играть в шахматы?", "<mark>Can</mark> you play chess?"],
          ["Что ты умеешь готовить?", "<mark>What can</mark> you <mark>cook</mark>?"],
        ]),
        p("В вопросах со словом порядок такой же, как везде в курсе: сначала вопросительное слово, потом can."),
        pit(
          `${no("I don't can swim.")} ${yes("I can't swim.")}`,
          `${no("Do you can drive?")} ${yes("Can you drive?")}`,
          `В коротком ответе только can: ${no("Yes, I can swim.")} ${yes("Yes, I can.")}`
        ),
        link("Урок 6, тема 3: to be или do — теперь добавился третий вариант, can")
      ),
      groups: [
        group("Выберите правильный вариант", [
          ch("I ___ ski.", ["can't", "don't can", "not can"], "can't", "Отрицание — can't."),
          ch("___ you help me?", ["Can", "Do", "Are"], "Can", "Вопрос с can."),
          ch("Can she swim? — Yes, she ___.", ["can", "cans", "does"], "can", "Yes, she can."),
          ch("Can they come tonight? — No, they ___.", ["can't", "don't", "aren't"], "can't", "No, they can't."),
          ch("What ___ you play?", ["can", "do can", "are"], "can", "What + can + you + play?"),
          ch("He ___ read without glasses.", ["can't", "doesn't can", "can not to"], "can't", "can't + read."),
        ]),
        group("Сделайте отрицание и вопрос", [
          inp("I can dance.", ["I can't dance.", "I cannot dance."], "can → can't.", "Сделайте отрицание"),
          inp("She can play the piano.", ["She can't play the piano.", "She cannot play the piano."], "can → can't.", "Сделайте отрицание"),
          inp("You can cook.", ["Can you cook?"], "Can + you + cook?", "Превратите в вопрос"),
          inp("He can drive a car.", ["Can he drive a car?"], "Can + he + drive a car?", "Превратите в вопрос"),
        ]),
        group("Нажмите на неправильное слово", [
          fix("I don't can swim.", "don't", "can't", "Отрицание — can't swim."),
          fix("Do you can play chess?", "Do", "Can", "Вопрос: Can you play chess?"),
          fix("She can sings very well.", "sings", "sing", "После can — sing."),
        ]),
      ],
    },
    {
      id: "ask", nav: "Can I…? Can you…?", eyebrow: "Тема 3 · просьбы и разрешения", title: "Can I…? — можно мне. Can you…? — сделай, пожалуйста",
      theory: html(
        p("Тот же <b>can</b> нужен для вежливых просьб и разрешений. Разница простая: <b>Can I…?</b> — про себя, <b>Can you…?</b> — про собеседника."),
        compare(
          ["Can I open the window?", "Можно открыть окно?", "прошу разрешения"],
          ["Can you open the window?", "Можешь открыть окно?", "прошу сделать"]
        ),
        table(["Фраза", "Когда говорят"], [
          ["<mark>Can I have</mark> a coffee, please?", "заказ в кафе, просьба дать"],
          ["<mark>Can I</mark> ask you a question?", "можно вопрос"],
          ["<mark>Can you</mark> help me, please?", "просьба о помощи"],
          ["<mark>Can you</mark> say that again, please?", "просьба повторить"],
          ["<mark>Could</mark> you help me, please?", "то же самое, но вежливее"],
          ["Sorry, I <mark>can't</mark>.", "вежливый отказ"],
        ]),
        p("Слово <b>please</b> ставят в конце или после подлежащего: Can you help me, <b>please</b>?"),
        examples([
          ["Можно мне чай, пожалуйста?", "<mark>Can I have</mark> a tea, please?"],
          ["Можешь передать мне соль?", "<mark>Can you pass</mark> me the salt?"],
          ["Конечно, вот.", "Sure, <mark>here you are</mark>.", "так отвечают, когда что-то передают"],
        ]),
        pit(
          `${no("Can I to have a coffee?")} ${yes("Can I have a coffee?")}`,
          `«Я хочу» в кафе звучит грубо: лучше ${yes("Can I have…?")} или I'd like… — это в уроке 12`,
          `Не путайте: Can I — можно мне, Can you — можешь ли ты.`
        ),
        link("Урок 12: I'd like — ещё более вежливый заказ в кафе")
      ),
      groups: [
        group("Can I или Can you?", [
          ch("___ have the menu, please? (вы в кафе)", ["Can I", "Can you"], "Can I", "Просите для себя → Can I."),
          ch("___ help me with this bag? (обращаетесь к другу)", ["Can I", "Can you"], "Can you", "Просите собеседника → Can you."),
          ch("___ use your phone? (ваш разрядился)", ["Can I", "Can you"], "Can I", "Просите разрешения → Can I."),
          ch("___ repeat that, please? (не расслышали)", ["Can I", "Can you"], "Can you", "Просите повторить → Can you."),
        ]),
        group("Выберите правильный вариант", [
          ch("«Можно мне воды, пожалуйста?»", ["Can I have some water, please?", "Can I to have water please?", "I want water."], "Can I have some water, please?", "Can I have + some water."),
          ch("«Можешь помочь мне, пожалуйста?»", ["Can you help me, please?", "Can you to help me please?", "Do you can help me?"], "Can you help me, please?", "Can you + help."),
          ch("— Can I sit here? — ___", ["Sure, of course.", "Yes, I can.", "Yes, you do."], "Sure, of course.", "На просьбу отвечают «конечно», а не «Yes, I can»."),
        ]),
        group("Составьте просьбу", [
          inp("(open the window — попросите собеседника)", ["Can you open the window, please?", "Can you open the window?"], "Can you + open the window.", "Составьте вежливую просьбу"),
          inp("(have a coffee — попросите для себя)", ["Can I have a coffee, please?", "Can I have a coffee?"], "Can I have + a coffee.", "Составьте вежливую просьбу"),
        ]),
      ],
    },
    {
      id: "final", nav: "Итоговый тест", eyebrow: "Итоговый тест · все темы вперемешку", title: "Проверьте себя",
      theory: p("Все темы урока вперемешку. Если ошибётесь, вернитесь к объяснению нужной темы через меню сверху."),
      groups: [
        group("Смешанные задания", [
          ch("My sister ___ very well.", ["can sing", "can sings", "cans sing"], "can sing", "Тема 1: can + sing."),
          ch("I ___ swim, but I can't ski.", ["can", "can to", "am can"], "can", "Тема 1: I can swim."),
          inp("He can drive.", ["He can't drive.", "He cannot drive."], "Тема 2: can → can't.", "Сделайте отрицание"),
          ch("___ you play the guitar? — No, I can't.", ["Can", "Do", "Are"], "Can", "Тема 2: Can you…?"),
          ch("«Можно мне чай?»", ["Can I have a tea, please?", "Can you have a tea?", "I can have a tea?"], "Can I have a tea, please?", "Тема 3: Can I have…?"),
          ch("«Можешь открыть дверь?»", ["Can you open the door?", "Can I open the door?", "Do you can open the door?"], "Can you open the door?", "Тема 3: просьба к собеседнику."),
          fix("I don't can come tomorrow.", "don't", "can't", "Тема 2: can't come."),
          ord("Can you help me please?", "Тема 3: Can + you + help me + please?"),
          ch("She can speak French ___.", ["a little", "a few", "little bit"], "a little", "Тема 1: a little — немного."),
          inp("«Я не умею танцевать.»", ["I can't dance.", "I cannot dance."], "Тема 2: can't dance.", "Переведите на английский"),
        ]),
      ],
    },
  ],
};

extend(lesson, "able", null, group("Переведите на английский", [
  inp("«Она умеет водить машину.»", ["She can drive.", "She can drive a car."], "can + drive.", "Переведите на английский"),
  inp("«Я немного говорю по-английски.»", ["I can speak English a little.", "I can speak a little English."], "a little — немного.", "Переведите на английский"),
  inp("«Мы можем встретиться завтра.»", ["We can meet tomorrow."], "can + meet.", "Переведите на английский"),
]));
extend(lesson, "cant", null, group("Соберите предложение", [
  ord("I can't come to the party.", "I + can't + come + to the party."),
  ord("Can you speak English?", "Can + you + speak English?"),
  ord("What can you cook?", "What + can + you + cook?"),
]));
extend(lesson, "ask", null, group("Что ответить?", [
  ch("— Can you help me? — Конечно.", ["Of course.", "Yes, I do.", "Yes, you can."], "Of course.", "Of course — конечно."),
  ch("— Can I sit here? — Нет, извините, тут занято.", ["Sorry, it's taken.", "No, I can't.", "No, you don't."], "Sorry, it's taken.", "Вежливый отказ."),
  ch("— Can you say that again, please? — ___", ["Sure. I said…", "Yes, I can say.", "No, I don't."], "Sure. I said…", "Просьбу повторить принимают словом Sure."),
]));

// «Переведите с русского» goes last in every topic; add new groups below this line so item ids stay the same.
addTranslation(lesson);

export default lesson;
