import { ch, inp, fix, ord, group, formula, table, examples, pit, no, yes, sticky, h3, p, compare, ng, html, extend } from "./_helpers.mjs";

const lesson = {
  slug: "have-got",
  title: "have got — у меня есть",
  subtitle: "have got / has got, отрицания и вопросы, have и do you have, прилагательные для описания вещей",
  position: 3,
  sections: [
    {
      id: "plus", nav: "have got", eyebrow: "Тема 1 · утверждение", title: "I've got, she's got — у меня есть, у неё есть",
      theory: html(
        p("По-русски говорим «<b>у меня есть</b> машина». По-английски наоборот: «<b>я имею</b> машину» — <b>I have got a car</b>. Так говорят о том, что у нас есть: вещи, семья, животные, внешность."),
        formula("кто", "!have got · has got", "что"),
        table(["Кто", "Полная форма", "Коротко", "Пример"], [
          ["I / you / we / they", "have got", "<mark>'ve got</mark>", "I've got a new phone."],
          ["he / she / it", "has got", "<mark>'s got</mark>", "She's got two sisters."],
        ]),
        examples([
          ["У меня есть брат.", "I<mark>'ve got</mark> a brother.", "семья"],
          ["У неё новый мобильный.", "She<mark>'s got</mark> a new mobile phone.", "вещи"],
          ["У нас есть собака.", "We<mark>'ve got</mark> a dog.", "животные"],
          ["У него карие глаза.", "He<mark>'s got</mark> brown eyes.", "внешность"],
          ["У моей квартиры есть сад.", "My flat <mark>has got</mark> a garden.", "flat = it → has"],
        ]),
        h3("'s — это is или has?"),
        p("Сокращение <b>'s</b> бывает двух видов. Смотрите, есть ли после него <b>got</b>."),
        compare(
          ["He's got a car.", "У него есть машина.", "'s + got = has got"],
          ["He's a good man.", "Он хороший человек.", "'s без got = is"]
        ),
        pit(
          `he / she / it — только has: ${no("She have got a cat.")} ${yes("She has got a cat.")}`,
          `Не забывайте got: ${no("I've a car.")} ${yes("I've got a car.")}`,
          `С he / she / it и с именами — 's, а не 've: ${no("Sara've got a bag.")} ${yes("Sara's got a bag.")}`
        ),
        sticky("have got / has got — иметь · I have got a brother · /has got — у меня есть / у него есть")
      ),
      groups: [
        group("have got или has got?", [
          ch("I ___ a new laptop.", ["have got", "has got"], "have got", "I → have got."),
          ch("My sister ___ a beautiful necklace.", ["have got", "has got"], "has got", "sister = she → has got."),
          ch("We ___ two cats.", ["have got", "has got"], "have got", "we → have got."),
          ch("Tom ___ blue eyes.", ["have got", "has got"], "has got", "Tom = he → has got."),
          ch("My parents ___ a big house.", ["have got", "has got"], "have got", "parents = they → have got."),
          ch("Our flat ___ a balcony.", ["have got", "has got"], "has got", "flat = it → has got."),
          ch("You ___ a lot of books!", ["have got", "has got"], "have got", "you → have got."),
        ]),
        group("Что значит 's?", [
          ch("She's got a new car. — 's = ___", ["is", "has"], "has", "После 's стоит got → has got."),
          ch("She's a doctor. — 's = ___", ["is", "has"], "is", "got нет → is: She is a doctor."),
          ch("It's heavy. — 's = ___", ["is", "has"], "is", "It is heavy — «оно тяжёлое»."),
          ch("He's got a dog. — 's = ___", ["is", "has"], "has", "'s + got → has got."),
        ]),
        group("Нажмите на неправильное слово", [
          fix("She have got two brothers.", "have", "has", "she → has got."),
          fix("They has got a garden.", "has", "have", "they → have got."),
          fix("I've a new camera.", "I've", "I've got", "have got — нужен got: I've got."),
        ]),
      ],
    },
    {
      id: "neg", nav: "haven't got", eyebrow: "Тема 2 · отрицание", title: "haven't got, hasn't got — у меня нет",
      theory: html(
        p("Чтобы сказать «у меня нет», ставим <b>not</b> после have / has. Got остаётся на месте."),
        formula("кто", "!haven't got · hasn't got", "что"),
        table(["Кто", "Полная форма", "Коротко", "Пример"], [
          ["I / you / we / they", "have not got", "<mark>haven't got</mark>", "I haven't got a car."],
          ["he / she / it", "has not got", "<mark>hasn't got</mark>", "She hasn't got big ears."],
        ]),
        h3("any — в отрицаниях и вопросах"),
        p("С предметами во множественном числе в отрицании и вопросе ставим <b>any</b>: «нет никаких», «есть ли какие-нибудь»."),
        examples([
          ["У меня нет братьев.", "I <mark>haven't got any</mark> brothers.", "haven't got + any + мн. число"],
          ["У него сейчас нет с собой камеры.", "He <mark>hasn't got</mark> a camera with him.", "одна вещь → a"],
          ["У нас нет времени.", "We <mark>haven't got</mark> time.", "time — нельзя посчитать, без a"],
        ]),
        pit(
          `После he / she / it — hasn't: ${no("He haven't got a bike.")} ${yes("He hasn't got a bike.")}`,
          `В отрицании с мн. числом нужен any, а не some: ${no("I haven't got some sisters.")} ${yes("I haven't got any sisters.")}`
        ),
        sticky("I haven't got any brothers · We haven't got · He hasn't got a car and he hasn't got a bike")
      ),
      groups: [
        group("Выберите правильную форму", [
          ch("I ___ a pen. Can I use yours?", ["haven't got", "hasn't got"], "haven't got", "I → haven't got."),
          ch("My brother ___ a car.", ["haven't got", "hasn't got"], "hasn't got", "brother = he → hasn't got."),
          ch("We haven't got ___ eggs.", ["some", "any", "a"], "any", "Отрицание + мн. число → any."),
          ch("She ___ any pets.", ["haven't got", "hasn't got"], "hasn't got", "she → hasn't got."),
          ch("They haven't got ___ garden.", ["a", "any", "some"], "a", "garden — одна вещь → a."),
        ]),
        group("Сделайте предложение отрицательным (как в домашнем задании)", [
          inp("We've got a large car.", ["We haven't got a large car.", "We have not got a large car."], "We've got → We haven't got.", "Сделайте отрицание"),
          inp("I've got a camera with me.", ["I haven't got a camera with me.", "I have not got a camera with me."], "I've got → I haven't got.", "Сделайте отрицание"),
          inp("My flat has got a garden.", ["My flat hasn't got a garden.", "My flat has not got a garden."], "has got → hasn't got.", "Сделайте отрицание"),
          inp("She's got a new phone.", ["She hasn't got a new phone.", "She has not got a new phone."], "She's got = She has got → She hasn't got.", "Сделайте отрицание"),
        ]),
        group("Сделайте предложение утвердительным", [
          inp("Sara hasn't got a bag with her.", ["Sara has got a bag with her.", "Sara's got a bag with her."], "hasn't got → has got. Sara = she → has.", "Сделайте утверждение"),
          inp("I haven't got time now.", ["I have got time now.", "I've got time now."], "haven't got → have got.", "Сделайте утверждение"),
        ]),
      ],
    },
    {
      id: "q", nav: "Have you got…?", eyebrow: "Тема 3 · вопрос", title: "Have you got…? — Yes, I have. / No, I haven't.",
      theory: html(
        p("В вопросе <b>Have / Has</b> выходит вперёд, а <b>got</b> остаётся после «кто»."),
        formula("!Have · Has", "кто", "!got", "что", "?"),
        table(["Вопрос", "Да", "Нет"], [
          ["<mark>Have</mark> you <mark>got</mark> a bike?", "Yes, I have.", "No, I haven't."],
          ["<mark>Has</mark> she <mark>got</mark> a sister?", "Yes, she has.", "No, she hasn't."],
          ["<mark>Have</mark> they <mark>got</mark> a car?", "Yes, they have.", "No, they haven't."],
        ]),
        p("В коротком ответе <b>got не нужен</b>: только Yes, I have / No, I haven't."),
        h3("Вопросы со словами"),
        formula("What / How many…", "!have · has", "кто", "!got", "?"),
        examples([
          ["Какая у тебя машина?", "<mark>What</mark> car <mark>have</mark> you <mark>got</mark>?"],
          ["Сколько у неё детей?", "<mark>How many</mark> children <mark>has</mark> she <mark>got</mark>?"],
          ["Какой у тебя телефон?", "<mark>What</mark> phone <mark>have</mark> you <mark>got</mark>?"],
        ]),
        pit(
          `В коротком ответе без got: ${no("No, I haven't got, sorry.")} ${yes("No, I haven't, sorry.")}`,
          `Не смешивайте do и got: ${no("Do you have got a car?")} ${yes("Have you got a car?")} или ${yes("Do you have a car?")}`
        ),
        sticky("Have you got a brother? · Yes, he's got a dog · Have you got the password? · What car / What pet / What phone")
      ),
      groups: [
        group("Выберите Have или Has", [
          ch("___ you got a minute?", ["Have", "Has"], "Have", "you → Have."),
          ch("___ Evan got any sisters?", ["Have", "Has"], "Has", "Evan = he → Has."),
          ch("___ they got a car?", ["Have", "Has"], "Have", "they → Have."),
          ch("___ your flat got a balcony?", ["Have", "Has"], "Has", "flat = it → Has."),
        ]),
        group("Выберите короткий ответ", [
          ch("Have you got a laptop? — Yes, ___.", ["I have", "I've got", "I do"], "I have", "Короткий ответ без got: Yes, I have.", { "I've got": "В кратком «да» сокращение и got не нужны: Yes, I have.", "I do": "Вопрос с have got → ответ с have." }),
          ch("Has Maisie got any children? — Yes, ___.", ["she has", "she have", "she's"], "she has", "Maisie = she → Yes, she has."),
          ch("Have they got a garden? — No, ___.", ["they haven't", "they haven't got", "they don't"], "they haven't", "Без got: No, they haven't."),
          ch("Has he got a sister? — No, ___.", ["he hasn't", "he haven't", "he isn't"], "he hasn't", "he → hasn't."),
        ]),
        group("Задайте вопрос (как в домашнем задании)", [
          inp("you / a car?", ["Have you got a car?"], "Have + you + got + a car?", "Составьте вопрос с have got"),
          inp("they / a garden?", ["Have they got a garden?"], "Have + they + got + a garden?", "Составьте вопрос с have got"),
          inp("she / any brothers or sisters?", ["Has she got any brothers or sisters?"], "she → Has she got…?", "Составьте вопрос с have got"),
          inp("you / the password?", ["Have you got the password?"], "Have you got the password?", "Составьте вопрос с have got"),
          inp("Scott / any pets?", ["Has Scott got any pets?"], "Scott = he → Has Scott got any pets?", "Составьте вопрос с have got"),
        ]),
        group("Соберите вопрос", [
          ord("What car have you got?", "What car + have + you + got?"),
          ord("How many children has she got?", "How many children + has + she + got?"),
          ord("Has your brother got a bike?", "Has + your brother + got + a bike?"),
        ]),
      ],
    },
    {
      id: "have", nav: "have и do you have", eyebrow: "Тема 4 · два способа", title: "I've got a car = I have a car",
      theory: html(
        p("«У меня есть» можно сказать двумя способами. Смысл одинаковый, различаются только отрицание и вопрос."),
        table(["", "have got", "have"], [
          ["+", "I<mark>'ve got</mark> a car.<br>She<mark>'s got</mark> a car.", "I <mark>have</mark> a car.<br>She <mark>has</mark> a car."],
          ["−", "I <mark>haven't got</mark> a car.<br>She <mark>hasn't got</mark> a car.", "I <mark>don't have</mark> a car.<br>She <mark>doesn't have</mark> a car."],
          ["?", "<mark>Have</mark> you <mark>got</mark> a car?<br><mark>Has</mark> she <mark>got</mark> a car?", "<mark>Do</mark> you <mark>have</mark> a car?<br><mark>Does</mark> she <mark>have</mark> a car?"],
          ["Ответ", "Yes, I have. / No, she hasn't.", "Yes, I do. / No, she doesn't."],
        ]),
        p("<b>have got</b> чаще звучит в британском разговорном английском. <b>have</b> с do / does — универсальный вариант, его понимают везде. Подробнее про do / does — в уроках 4 и 5."),
        pit(
          `Выберите один способ и не смешивайте: ${no("Does Scott has got any pets?")} ${yes("Has Scott got any pets?")} ${yes("Does Scott have any pets?")}`,
          `После doesn't и does — have, а не has: ${no("She doesn't has a car.")} ${yes("She doesn't have a car.")}`,
          `Возраст — не через have: ${no("I have 30 years.")} ${yes("I'm 30.")}`
        ),
        sticky("to have / has — иметь: I have a car · I don't have a car · Do you have a car?")
      ),
      groups: [
        group("Выберите правильный вариант", [
          ch("___ you have a pen?", ["Do", "Have", "Are"], "Do", "have без got → вопрос с Do."),
          ch("___ you got a pen?", ["Do", "Have", "Are"], "Have", "С got → Have you got…?"),
          ch("She doesn't ___ a car.", ["has", "have", "has got"], "have", "После doesn't — have."),
          ch("Do you have any brothers? — No, I ___.", ["don't", "haven't", "am not"], "don't", "Вопрос с Do → ответ No, I don't."),
          ch("Have you got any brothers? — No, I ___.", ["don't", "haven't", "am not"], "haven't", "Вопрос с Have… got → ответ No, I haven't."),
          ch("«Мне 25 лет.»", ["I have 25 years.", "I'm 25.", "I've got 25 years."], "I'm 25.", "Возраст — через to be."),
        ]),
        group("Скажите то же самое по-другому", [
          inp("I haven't got a car.", ["I don't have a car.", "I do not have a car."], "haven't got → don't have.", "Перепишите с don't / doesn't have"),
          inp("Has she got a sister?", ["Does she have a sister?"], "Has she got → Does she have.", "Перепишите с do / does"),
          inp("Do they have a garden?", ["Have they got a garden?"], "Do they have → Have they got.", "Перепишите с have got"),
          inp("He doesn't have a bike.", ["He hasn't got a bike.", "He has not got a bike."], "doesn't have → hasn't got.", "Перепишите с have got"),
        ]),
        group("Нажмите на неправильное слово", [
          fix("Does Scott has any pets?", "has", "have", "После Does — have."),
          fix("Do you have got a car?", "Do", "Have", "С got вопрос начинается с Have: Have you got a car?"),
          fix("She doesn't has a dog.", "has", "have", "После doesn't — have."),
        ]),
      ],
    },
    {
      id: "adj", nav: "Описание вещей", eyebrow: "Тема 5 · лексика", title: "Какая это вещь? Прилагательные",
      theory: html(
        p("Слова из урока «Special things» — ими описывают предметы."),
        ng(
          ["Размер и форма", ["large / big — большой", "small — маленький", "round — круглый", "square — квадратный", "heavy — тяжёлый", "light — лёгкий"]],
          ["Возраст и состояние", ["old — старый", "new — новый", "modern — современный", "broken — сломанный", "soft — мягкий", "comfortable — удобный"]]
        ),
        ng(
          ["Цвет и материал", ["brown — коричневый", "gold — золотой", "silver — серебряный"]],
          ["Оценка", ["beautiful — красивый", "useful — полезный", "special — особенный", "handsome / good-looking — красивый (о человеке)"]]
        ),
        h3("Где ставить прилагательное"),
        p("Прилагательное стоит <b>перед</b> предметом или <b>после to be</b>. Оно не меняется во множественном числе."),
        examples([
          ["У меня тяжёлая сумка.", "I've got a <mark>heavy</mark> bag.", "перед предметом"],
          ["Сумка тяжёлая и не очень удобная.", "It's <mark>heavy</mark> and it isn't very <mark>comfortable</mark>.", "после is"],
          ["Это красивые серьги.", "They're <mark>beautiful</mark> earrings.", "без -s: не beautifuls"],
          ["Мой ноутбук сломан, я не могу им пользоваться.", "My laptop is <mark>broken</mark>. I can't use it."],
        ]),
        h3("Противоположности"),
        table(["Слово", "Противоположное"], [
          ["old", "new · modern"], ["heavy", "light"], ["large / big", "small"], ["comfortable", "<mark>un</mark>comfortable"], ["useful", "use<mark>less</mark>"],
        ]),
        pit(
          `Прилагательное не получает -s: ${no("They are olds phones.")} ${yes("They are old phones.")}`,
          `Порядок как в русском, но a / an — перед прилагательным: ${no("I've got heavy a bag.")} ${yes("I've got a heavy bag.")}`,
          `handsome и good-looking — о людях: ${yes("He's handsome.")}, а о вещи — ${yes("a beautiful watch")}`
        ),
        sticky("It is heavy and it is not very comfortable · handsome / good-looking · what can be beautiful?")
      ),
      groups: [
        group("Выберите слово (как в домашнем задании)", [
          ch("I love my teddy bear. He's really ___.", ["soft", "broken", "square"], "soft", "Плюшевый мишка — мягкий: soft."),
          ch("My laptop is ___. I can't use it.", ["useful", "broken", "light"], "broken", "Не могу пользоваться → сломан: broken."),
          ch("My new mobile is small, ___ and easy to use.", ["heavy", "light", "square"], "light", "small и easy to use → лёгкий: light."),
          ch("A vocabulary notebook is very ___.", ["useful", "broken", "round"], "useful", "Словарная тетрадь полезная: useful."),
          ch("My gloves are so ___. They feel very nice.", ["comfortable", "round", "broken"], "comfortable", "Приятно носить → удобные: comfortable."),
          ch("Do you prefer the square table or the ___ one?", ["round", "soft", "gold"], "round", "square — квадратный, противоположная форма — round."),
        ]),
        group("Напишите противоположное слово", [
          inp("old →", ["new", "modern"], "old → new (или modern).", "Напишите противоположное прилагательное", "Начинается на n."),
          inp("heavy →", ["light"], "heavy → light.", "Напишите противоположное прилагательное", "Начинается на l."),
          inp("small →", ["large", "big"], "small → large / big.", "Напишите противоположное прилагательное", "large или b…"),
          inp("comfortable →", ["uncomfortable"], "un + comfortable.", "Напишите противоположное прилагательное", "Приставка un-."),
        ]),
        group("Соберите предложение", [
          ord("I've got a beautiful gold watch.", "a + beautiful + gold + watch."),
          ord("My bag is heavy and old.", "My bag + is + heavy and old."),
          ord("She has got a new red bike.", "a + new + red + bike."),
        ]),
      ],
    },
    {
      id: "words", nav: "Фразы с доски", eyebrow: "Тема 6 · фразы со стикеров", title: "Фразы с ваших стикеров",
      theory: html(
        h3("everything · everybody · everywhere"),
        p("<b>every</b> — каждый. Добавляем слово и получаем «всё, все, везде»."),
        table(["Слово", "Значение", "Пример"], [
          ["every + thing", "<mark>everything</mark> — всё", "Everything is OK."],
          ["every + body / one", "<mark>everybody</mark> / everyone — все (люди)", "Everybody is here."],
          ["every + where", "<mark>everywhere</mark> — везде", "My laptop is always with me — everywhere."],
        ]),
        p("После everything / everybody — глагол как с <b>he / she / it</b>: Everybody <b>is</b> happy (а не are)."),
        h3("the same as — такой же, как"),
        examples([["Сегодня всё так же, как вчера.", "Today is <mark>the same as</mark> yesterday."]]),
        h3("to lie — два значения"),
        examples([
          ["Я тебе не вру.", "I don't <mark>lie</mark> to you.", "lie — лгать"],
          ["Кошка лежит на земле.", "The cat <mark>is lying</mark> on the ground.", "lie — лежать"],
        ]),
        h3("special for — особенный для"),
        examples([["Ноутбук особенно важен для Ника.", "The laptop is <mark>special for</mark> Nick.", "Nick: «It's always with me»"]]),
        pit(`После everybody — is: ${no("Everybody are here.")} ${yes("Everybody is here.")}`),
        sticky("everything / everybody / everywhere · the same as yesterday · to lie · Laptop is special for Nick · ring · chair · ground")
      ),
      groups: [
        group("Выберите правильный вариант", [
          ch("«Всё хорошо.» — ___ is fine.", ["Everything", "Everybody", "Everywhere"], "Everything", "всё (о вещах, делах) → everything."),
          ch("«Все пришли.» — ___ is here.", ["Everything", "Everybody", "Everywhere"], "Everybody", "все люди → everybody."),
          ch("I take my phone ___.", ["everything", "everybody", "everywhere"], "everywhere", "везде → everywhere."),
          ch("Everybody ___ happy today.", ["is", "are"], "is", "После everybody — is."),
          ch("My new bag is the same ___ yours.", ["as", "like", "that"], "as", "the same as — такой же, как."),
          ch("«Не лги мне!» — Don't ___ to me!", ["lie", "lay", "lying"], "lie", "lie — лгать."),
        ]),
      ],
    },
    {
      id: "final", nav: "Итоговый тест", eyebrow: "Итоговый тест · все темы вперемешку", title: "Проверьте себя",
      theory: p("Все темы урока вперемешку. Если ошибётесь, вернитесь к объяснению нужной темы через меню сверху."),
      groups: [
        group("Смешанные задания", [
          ch("My brother ___ a new motorbike.", ["have got", "has got"], "has got", "Тема 1: brother = he → has got."),
          ch("She's got long hair. — 's = ___", ["is", "has"], "has", "Тема 1: 's + got = has got."),
          inp("They've got a dog.", ["They haven't got a dog.", "They have not got a dog."], "Тема 2: 've got → haven't got.", "Сделайте отрицание"),
          ch("Has your sister got a car? — Yes, ___.", ["she has", "she's got", "she does"], "she has", "Тема 3: без got: Yes, she has."),
          ord("Have you got any brothers or sisters?", "Тема 3: Have + you + got + any brothers or sisters?"),
          fix("Does she has a laptop?", "has", "have", "Тема 4: после Does — have."),
          inp("I don't have a bike.", ["I haven't got a bike.", "I have not got a bike."], "Тема 4: don't have → haven't got.", "Перепишите с have got"),
          ch("This chair is very ___. I love sitting in it.", ["comfortable", "broken", "heavy"], "comfortable", "Тема 5: приятно сидеть → comfortable."),
          fix("I've got two olds watches.", "olds", "old", "Тема 5: прилагательное без -s."),
          ch("«Везде» — ___", ["everything", "everybody", "everywhere"], "everywhere", "Тема 6: every + where."),
          ch("We haven't got ___ milk. Can you buy some?", ["a", "any", "some"], "any", "Тема 2: в отрицании → any."),
          inp("he / a big house?", ["Has he got a big house?"], "Тема 3: he → Has he got…?", "Составьте вопрос с have got"),
        ]),
      ],
    },
  ],
};

// Added after a second check of the board: write / wrote.
extend(lesson, "words", html(
  h3("write — wrote: первый неправильный глагол"),
  p("У Ника (Nick, 44) в тексте: «I'm a <b>writer</b>». На доске рядом записано <b>write / wrote</b>. Это пара «сейчас / в прошлом»: у многих глаголов прошлое образуется не через -ed, а своей формой."),
  table(["Сейчас", "В прошлом", "Пример"], [
    ["write — писать", "<mark>wrote</mark> — писал", "He wrote a book last year."],
    ["have — иметь", "<mark>had</mark> — имел", "I had a dog when I was a child."],
    ["am / is — есть", "<mark>was</mark> — был", "It was cold yesterday."],
  ]),
  p("writer — писатель: write + r. Так же drive → driver (урок 5)."),
  sticky("write / wrote")
), group("write, wrote, writer", [
  ch("Nick is a ___. He writes books.", ["writer", "wrote", "writing"], "writer", "Профессия → writer."),
  ch("Yesterday I ___ a long email to my boss.", ["write", "wrote", "writes"], "wrote", "yesterday → прошлое → wrote."),
  ch("I ___ in my diary every evening.", ["write", "wrote", "writer"], "write", "every evening — обычно → write."),
]));

export default lesson;
