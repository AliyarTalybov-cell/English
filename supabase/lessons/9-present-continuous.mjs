import { ch, inp, fix, ord, group, formula, table, examples, pit, no, yes, sticky, h3, p, compare, ng, html, extend } from "./_helpers.mjs";
import { addTranslation } from "./translate.mjs";

const link = text => sticky(text, "Связь с курсом");

const lesson = {
  slug: "present-continuous",
  title: "Прямо сейчас: Present Continuous",
  subtitle: "I'm working, окончание -ing, отрицания и вопросы, «сейчас» и «обычно»",
  position: 8,
  sections: [
    {
      id: "form", nav: "I'm working", eyebrow: "Тема 1 · утверждение", title: "am / is / are + глагол-ing",
      theory: html(
        p("Present Continuous — про то, что происходит <b>прямо сейчас</b>, в момент разговора. В уроке 1 вы это уже видели: «Look! It's raining»."),
        formula("кто", "!am · is · are", "!глагол + ing", "остальное"),
        table(["Кто", "Форма", "Пример"], [
          ["I", "<mark>am</mark> + ing", "I'm working now."],
          ["he / she / it", "<mark>is</mark> + ing", "She's cooking dinner."],
          ["we / you / they", "<mark>are</mark> + ing", "They're watching TV."],
        ]),
        h3("Как добавлять -ing"),
        table(["Глагол кончается на…", "Что делаем", "Примеры"], [
          ["обычный случай", "+ <mark>ing</mark>", "work → working · play → playing"],
          ["-e", "e уходит", "make → mak<mark>ing</mark> · write → writing · come → coming"],
          ["короткий глагол на гласная + согласная", "буква удваивается", "run → ru<mark>nn</mark>ing · sit → sitting · get → getting"],
          ["-ie", "ie → <mark>y</mark>", "lie → lying"],
        ]),
        examples([
          ["Смотри! Идёт снег.", "Look! It<mark>'s snowing</mark>.", "прямо сейчас"],
          ["Мы ждём автобус.", "We<mark>'re waiting</mark> for the bus."],
          ["Я сейчас готовлю ужин.", "I<mark>'m cooking</mark> dinner at the moment."],
          ["Дети играют в саду.", "The children <mark>are playing</mark> in the garden."],
        ]),
        h3("Слова-подсказки"),
        p("<b>now</b> — сейчас, <b>at the moment</b> — в данный момент, <b>right now</b> — прямо сейчас, <b>Look!</b> и <b>Listen!</b> — смотри, слушай."),
        pit(
          `Без am / is / are форма не работает: ${no("I working now.")} ${yes("I'm working now.")}`,
          `Не путайте с привычкой: ${no("I am work every day.")} ${yes("I work every day.")}`
        ),
        link("Урок 1, тема 10: первые примеры с -ing · Урок 1, тема 1: am / is / are")
      ),
      groups: [
        group("Напишите форму с -ing", [
          inp("work →", ["working"], "+ ing.", "Напишите глагол с -ing", "Обычный случай."),
          inp("make →", ["making"], "Кончается на -e: e уходит.", "Напишите глагол с -ing", "Без e."),
          inp("run →", ["running"], "Короткий глагол: буква удваивается.", "Напишите глагол с -ing", "Две n."),
          inp("study →", ["studying"], "y остаётся: studying.", "Напишите глагол с -ing", "y не меняется."),
          inp("sit →", ["sitting"], "Буква удваивается.", "Напишите глагол с -ing", "Две t."),
          inp("write →", ["writing"], "e уходит.", "Напишите глагол с -ing", "Без e."),
        ]),
        group("Выберите правильную форму", [
          ch("I ___ a book at the moment.", ["am reading", "reading", "read"], "am reading", "at the moment → am + reading."),
          ch("She ___ to music right now.", ["is listening", "listens", "listening"], "is listening", "right now → is + listening."),
          ch("We ___ dinner. Call later.", ["are having", "have", "having"], "are having", "Прямо сейчас → are having."),
          ch("Look! The cat ___ on your laptop.", ["sits", "is sitting", "sitting"], "is sitting", "Look! → сейчас."),
          ch("They ___ football in the park now.", ["play", "are playing", "playing"], "are playing", "now → are playing."),
        ]),
        group("Соберите предложение", [
          ord("I am cooking dinner now.", "I + am + cooking + dinner + now."),
          ord("She is writing an email.", "She + is + writing + an email."),
          ord("The children are sleeping.", "The children + are + sleeping."),
        ]),
      ],
    },
    {
      id: "negq", nav: "Отрицание и вопрос", eyebrow: "Тема 2 · отрицание и вопрос", title: "I'm not working. Are you working?",
      theory: html(
        p("Здесь всё как с to be из урока 1: <b>not</b> ставится после am / is / are, а в вопросе am / is / are выходит вперёд. Глагол с -ing не меняется."),
        formula("кто", "!am · is · are", "!not", "глагол + ing"),
        formula("!Am · Is · Are", "кто", "глагол + ing", "?"),
        table(["Вопрос", "Да", "Нет"], [
          ["<mark>Are</mark> you working?", "Yes, I am.", "No, I'm not."],
          ["<mark>Is</mark> she sleeping?", "Yes, she is.", "No, she isn't."],
          ["<mark>Are</mark> they waiting?", "Yes, they are.", "No, they aren't."],
        ]),
        examples([
          ["Я сейчас не работаю.", "I<mark>'m not working</mark> now."],
          ["Он не спит, он читает.", "He <mark>isn't sleeping</mark>, he's reading."],
          ["Что ты делаешь?", "<mark>What are</mark> you <mark>doing</mark>?", "самый частый вопрос этой темы"],
          ["Куда ты идёшь?", "<mark>Where are</mark> you <mark>going</mark>?"],
        ]),
        pit(
          `Не смешивайте с do: ${no("Do you working?")} ${yes("Are you working?")}`,
          `В коротком «да» нет -ing: ${no("Yes, I am working.")} — понятно, но короче и правильнее ${yes("Yes, I am.")}`,
          `${no("I not working.")} ${yes("I'm not working.")}`
        ),
        link("Урок 1, тема 2 и 3: отрицание и вопрос с to be · Урок 6: Do / Does — для привычек, а не для «сейчас»")
      ),
      groups: [
        group("Выберите правильный вариант", [
          ch("___ you watching TV?", ["Are", "Do", "Is"], "Are", "you → Are."),
          ch("___ she working today?", ["Is", "Are", "Does"], "Is", "she → Is."),
          ch("I ___ waiting for anybody.", ["am not", "don't", "not"], "am not", "am + not + waiting."),
          ch("Are they having lunch? — Yes, they ___.", ["are", "do", "have"], "are", "Yes, they are."),
          ch("Is he sleeping? — No, he ___.", ["isn't", "doesn't", "not"], "isn't", "No, he isn't."),
          ch("What ___ you doing?", ["are", "do", "is"], "are", "Сейчас → What are you doing?"),
        ]),
        group("Сделайте отрицание и вопрос", [
          inp("She is cooking dinner.", ["She isn't cooking dinner.", "She is not cooking dinner."], "is → isn't.", "Сделайте отрицание"),
          inp("They are playing outside.", ["They aren't playing outside.", "They are not playing outside."], "are → aren't.", "Сделайте отрицание"),
          inp("You are listening to me.", ["Are you listening to me?"], "Are + you + listening…?", "Превратите в вопрос"),
          inp("He is working today.", ["Is he working today?"], "Is + he + working…?", "Превратите в вопрос"),
        ]),
        group("Нажмите на неправильное слово", [
          fix("Do you waiting for me?", "Do", "Are", "Сейчас → Are you waiting…?"),
          fix("She don't sleeping now.", "don't", "isn't", "С -ing нужен isn't: She isn't sleeping now."),
          fix("What are you do now?", "do", "doing", "Сейчас → doing."),
        ]),
      ],
    },
    {
      id: "vs", nav: "сейчас или обычно", eyebrow: "Тема 3 · главное различие", title: "I work или I'm working?",
      theory: html(
        p("Самая важная тема урока. Два настоящих времени отличаются не переводом, а <b>смыслом</b>."),
        compare(
          ["I work in a bank.", "Я работаю в банке.", "вообще, всегда — Present Simple, урок 4"],
          ["I'm working at home today.", "Сегодня я работаю дома.", "сейчас, временно — Present Continuous"]
        ),
        table(["", "Present Simple", "Present Continuous"], [
          ["Когда", "обычно, всегда, каждый день", "прямо сейчас, сегодня, на этой неделе"],
          ["Слова", "always, usually, often, every day", "now, at the moment, today, Look!"],
          ["Форма", "I work · he work<mark>s</mark>", "I<mark>'m</mark> work<mark>ing</mark> · he<mark>'s</mark> working"],
          ["Отрицание", "don't / doesn't work", "am not / isn't / aren't working"],
          ["Вопрос", "Do / Does … work?", "Am / Is / Are … working?"],
        ]),
        examples([
          ["Она обычно ходит пешком, но сегодня едет на автобусе.", "She usually <mark>walks</mark>, but today she<mark>'s taking</mark> the bus."],
          ["Я не пью кофе. — Но ты сейчас его пьёшь!", "I <mark>don't drink</mark> coffee. — But you<mark>'re drinking</mark> it now!"],
          ["Что ты обычно делаешь по вечерам?", "What <mark>do</mark> you usually <mark>do</mark> in the evenings?"],
          ["Что ты делаешь? — Готовлю ужин.", "What <mark>are</mark> you <mark>doing</mark>? — I'm cooking dinner."],
        ]),
        h3("Глаголы, которые почти не бывают с -ing"),
        p("Это глаголы чувств и мыслей: <b>know, like, love, want, need, understand, remember</b>. Их ставят в Present Simple даже про момент «сейчас»."),
        pit(
          `${no("I am knowing the answer.")} ${yes("I know the answer.")}`,
          `${no("I am wanting coffee.")} ${yes("I want coffee.")}`,
          `${no("Every day I'm going to work.")} ${yes("Every day I go to work.")}`
        ),
        link("Урок 4 и 5: Present Simple · Урок 6: вопросы do / does — сравните с Am / Is / Are")
      ),
      groups: [
        group("Выберите правильную форму", [
          ch("I usually ___ at 7, but today I'm working late.", ["finish", "am finishing"], "finish", "usually → Present Simple."),
          ch("Be quiet! The baby ___.", ["sleeps", "is sleeping"], "is sleeping", "Прямо сейчас → is sleeping."),
          ch("My sister ___ in a hospital.", ["works", "is working"], "works", "Постоянная работа → works."),
          ch("Where's Tom? — He ___ a shower.", ["has", "is having"], "is having", "Сейчас → is having."),
          ch("We ___ to the sea every summer.", ["go", "are going"], "go", "every summer → Present Simple."),
          ch("Look! It ___.", ["rains", "is raining"], "is raining", "Look! → сейчас."),
          ch("I ___ what you mean.", ["understand", "am understanding"], "understand", "understand почти не бывает с -ing."),
          ch("She ___ a new phone.", ["wants", "is wanting"], "wants", "want — без -ing."),
        ]),
        group("Какое предложение правильное?", [
          ch("«Я каждый день хожу на работу пешком.»", ["I walk to work every day.", "I'm walking to work every day.", "I am walk to work every day."], "I walk to work every day.", "Привычка → Present Simple."),
          ch("«Сейчас я смотрю фильм.»", ["I'm watching a film now.", "I watch a film now.", "I am watch a film now."], "I'm watching a film now.", "Сейчас → am watching."),
          ch("«Он не работает сегодня.»", ["He isn't working today.", "He doesn't working today.", "He don't work today."], "He isn't working today.", "today → isn't working."),
        ]),
        group("Задайте вопрос", [
          inp("(you / what / do / now?)", ["What are you doing now?"], "Сейчас → What are you doing now?", "Составьте вопрос"),
          inp("(you / what / do / at the weekend?)", ["What do you do at the weekend?"], "Обычно → What do you do at the weekend?", "Составьте вопрос"),
        ]),
      ],
    },
    {
      id: "photo", nav: "Описание фото", eyebrow: "Тема 4 · речь", title: "Опишите фотографию",
      theory: html(
        p("Present Continuous удобен, когда мы описываем картинку или фото: на ней люди что-то делают прямо сейчас."),
        h3("Полезные фразы"),
        table(["Фраза", "Перевод"], [
          ["In the photo I can see…", "На фото я вижу…"],
          ["There is / There are…", "Есть, находится…"],
          ["A man <mark>is standing</mark> on the left.", "Слева стоит мужчина."],
          ["Two children <mark>are playing</mark> in the middle.", "Посередине играют двое детей."],
          ["They <mark>look</mark> happy.", "Они выглядят счастливыми."],
          ["I think they <mark>are</mark> friends.", "Думаю, они друзья."],
        ]),
        h3("Глаголы для описания"),
        ng(
          ["Положение", ["stand — стоять", "sit — сидеть", "lie — лежать", "walk — идти пешком", "run — бежать"]],
          ["Занятия", ["talk — разговаривать", "smile — улыбаться", "hold — держать", "wear — быть одетым в", "carry — нести"]]
        ),
        examples([
          ["Женщина держит телефон.", "A woman <mark>is holding</mark> a phone."],
          ["Он в синей рубашке.", "He<mark>'s wearing</mark> a blue shirt.", "wear — про одежду на человеке"],
          ["Они разговаривают и улыбаются.", "They<mark>'re talking</mark> and <mark>smiling</mark>.", "второй глагол тоже с -ing"],
        ]),
        pit(
          `«Одет в» — это wear, а не dress: ${no("He is dressing a blue shirt.")} ${yes("He is wearing a blue shirt.")}`,
          `look в значении «выглядит» идёт без -ing: ${yes("They look happy.")}`
        ),
        link("Урок 2: слова о вещах · Урок 9: предлоги места — они тоже нужны для описания фото")
      ),
      groups: [
        group("Выберите слово", [
          ch("A man is ___ a red jacket.", ["wearing", "dressing", "having"], "wearing", "wear — быть одетым в."),
          ch("Two women are ___ on a bench.", ["sitting", "siting", "sit"], "sitting", "sit → sitting, буква удваивается."),
          ch("The dog is ___ on the grass.", ["lying", "lieing", "laying"], "lying", "lie → lying."),
          ch("They ___ very happy in this photo.", ["look", "are looking"], "look", "«выглядят» → look."),
          ch("A girl is ___ a big bag.", ["carrying", "carring", "carries"], "carrying", "carry → carrying."),
        ]),
        group("Опишите фото", [
          inp("(a man / stand / on the left)", ["A man is standing on the left."], "A man + is + standing + on the left.", "Составьте предложение"),
          inp("(two children / play / in the park)", ["Two children are playing in the park."], "children = they → are playing.", "Составьте предложение"),
          inp("(she / talk / on the phone)", ["She is talking on the phone.", "She's talking on the phone."], "She + is + talking.", "Составьте предложение"),
        ]),
      ],
    },
    {
      id: "final", nav: "Итоговый тест", eyebrow: "Итоговый тест · все темы вперемешку", title: "Проверьте себя",
      theory: p("Все темы урока вперемешку. Если ошибётесь, вернитесь к объяснению нужной темы через меню сверху."),
      groups: [
        group("Смешанные задания", [
          inp("come →", ["coming"], "Тема 1: e уходит.", "Напишите глагол с -ing", "Без e."),
          ch("Listen! Somebody ___.", ["sings", "is singing"], "is singing", "Тема 1: Listen! → сейчас."),
          ch("I ___ my homework at the moment.", ["do", "am doing"], "am doing", "Тема 1: at the moment → am doing."),
          inp("They are having lunch.", ["They aren't having lunch.", "They are not having lunch."], "Тема 2: are → aren't.", "Сделайте отрицание"),
          ch("___ he working today? — Yes, he is.", ["Is", "Does", "Do"], "Is", "Тема 2: he → Is."),
          ch("My parents ___ TV every evening.", ["watch", "are watching"], "watch", "Тема 3: every evening → Present Simple."),
          ch("Sorry, I can't talk. I ___ the bus.", ["catch", "am catching"], "am catching", "Тема 3: сейчас → am catching."),
          ch("I ___ this song!", ["love", "am loving"], "love", "Тема 3: love — без -ing."),
          ord("What are you doing now?", "Тема 2: What + are + you + doing + now?"),
          fix("She is wear a red dress.", "wear", "wearing", "Тема 4: is + wearing."),
          inp("«Дети играют в саду.»", ["The children are playing in the garden.", "Children are playing in the garden."], "Тема 1: are + playing.", "Переведите на английский"),
          ch("What ___ you usually do after work?", ["do", "are"], "do", "Тема 3: usually → Present Simple."),
        ]),
      ],
    },
  ],
};

extend(lesson, "form", null, group("Переведите на английский", [
  inp("«Я сейчас читаю.»", ["I'm reading now.", "I am reading now."], "am + reading.", "Переведите на английский"),
  inp("«Она разговаривает по телефону.»", ["She's talking on the phone.", "She is talking on the phone."], "is + talking.", "Переведите на английский"),
  inp("«Мы ждём автобус.»", ["We're waiting for the bus.", "We are waiting for the bus."], "are + waiting for.", "Переведите на английский"),
]));
extend(lesson, "vs", null, group("Сейчас или обычно?", [
  ch("Hurry up! The bus ___.", ["comes", "is coming"], "is coming", "Прямо сейчас → is coming."),
  ch("My father ___ coffee every morning.", ["drinks", "is drinking"], "drinks", "every morning → Present Simple."),
  ch("Why ___ you wearing a coat? It's hot!", ["do", "are"], "are", "Сейчас → are you wearing."),
  ch("How often ___ you go to the gym?", ["do", "are"], "do", "How often → Present Simple."),
  inp("«Обычно я работаю в офисе, но сегодня работаю дома.»", ["I usually work in the office, but today I'm working at home.", "I usually work in an office, but today I'm working at home."], "usually work + today I'm working.", "Переведите на английский"),
]));

// «Переведите с русского» goes last in every topic; add new groups below this line so item ids stay the same.
addTranslation(lesson);

export default lesson;
