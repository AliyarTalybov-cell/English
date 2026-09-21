import { ch, inp, fix, ord, group, formula, table, examples, pit, no, yes, sticky, h3, p, compare, ng, html, extend } from "./_helpers.mjs";

const link = text => sticky(text, "Связь с курсом");

const lesson = {
  slug: "there-is",
  title: "there is / there are: что где находится",
  subtitle: "there is / there are, some и any, предлоги места, дом и комнаты, город",
  position: 9,
  sections: [
    {
      id: "form", nav: "there is · are", eyebrow: "Тема 1 · есть, находится", title: "There is a table. There are two chairs.",
      theory: html(
        p("Когда мы говорим, что <b>что-то где-то есть</b>, по-русски получается «в комнате есть стол» или просто «в комнате стол». По-английски такое предложение начинается с <b>there is</b> или <b>there are</b>."),
        formula("!There is · There are", "что", "где"),
        table(["Сколько", "Форма", "Пример"], [
          ["один предмет", "<mark>There is</mark> (There's)", "There's a lamp on the table."],
          ["несколько", "<mark>There are</mark>", "There are two windows in the room."],
        ]),
        compare(
          ["There is a café near my house.", "Рядом с домом есть кафе.", "говорим, что кафе существует"],
          ["The café is near my house.", "Кафе рядом с моим домом.", "кафе уже известно, говорим, где оно"]
        ),
        examples([
          ["В моей комнате есть кровать и шкаф.", "<mark>There's</mark> a bed and a wardrobe in my room."],
          ["В холодильнике есть молоко.", "<mark>There's</mark> some milk in the fridge.", "молоко не считается → some"],
          ["В нашем доме пять этажей.", "<mark>There are</mark> five floors in our building."],
        ]),
        p("Форма выбирается по <b>первому</b> предмету после there: There's a chair and two tables."),
        pit(
          `Это не «он / она»: ${no("It is a café near my house.")} ${yes("There is a café near my house.")}`,
          `Не путайте с their (их) и they're (они есть): there — «там, есть».`,
          `${no("There are a book on the table.")} ${yes("There is a book on the table.")}`
        ),
        link("Урок 1: to be · Урок 2: this / these — здесь «есть» звучит иначе")
      ),
      groups: [
        group("There is или There are?", [
          ch("___ a big park near my house.", ["There is", "There are"], "There is", "a park — один → There is."),
          ch("___ three bedrooms in our flat.", ["There is", "There are"], "There are", "three bedrooms → There are."),
          ch("___ a lot of people in the shop.", ["There is", "There are"], "There are", "people — много → There are."),
          ch("___ some water in the bottle.", ["There is", "There are"], "There is", "water не считается → There is."),
          ch("___ two cafés and a bank in my street.", ["There is", "There are"], "There are", "Сначала идут two cafés → There are."),
        ]),
        group("Какое предложение правильное?", [
          ch("«В комнате есть окно.»", ["There is a window in the room.", "It is a window in the room.", "There are a window in the room."], "There is a window in the room.", "There is + a window."),
          ch("«В городе много магазинов.»", ["There are a lot of shops in the city.", "There is a lot of shops in the city.", "In the city have a lot of shops."], "There are a lot of shops in the city.", "shops — несколько → There are."),
          ch("«Мой телефон на столе.»", ["My phone is on the table.", "There is my phone on the table."], "My phone is on the table.", "Телефон уже известен — это обычное предложение с to be."),
        ]),
        group("Соберите предложение", [
          ord("There is a lamp on the table.", "There is + a lamp + on the table."),
          ord("There are four chairs in the kitchen.", "There are + four chairs + in the kitchen."),
        ]),
      ],
    },
    {
      id: "negq", nav: "some · any", eyebrow: "Тема 2 · отрицание и вопрос", title: "There isn't any… Is there a…?",
      theory: html(
        formula("!There isn't · There aren't", "!any", "что"),
        formula("!Is there · Are there", "что", "где", "?"),
        table(["Вопрос", "Да", "Нет"], [
          ["<mark>Is there</mark> a bank near here?", "Yes, there is.", "No, there isn't."],
          ["<mark>Are there</mark> any shops?", "Yes, there are.", "No, there aren't."],
        ]),
        h3("some и any"),
        p("Вы уже видели <b>any</b> в уроке 3 с have got. Правило то же самое."),
        table(["Где", "Что ставим", "Пример"], [
          ["утверждение", "<mark>some</mark> — немного, несколько", "There are some eggs in the fridge."],
          ["отрицание", "<mark>any</mark>", "There isn't any bread."],
          ["вопрос", "<mark>any</mark>", "Are there any cafés near here?"],
          ["один предмет", "<mark>a / an</mark>", "Is there a pharmacy in this street?"],
        ]),
        examples([
          ["В комнате нет телевизора.", "<mark>There isn't</mark> a TV in the room."],
          ["Здесь поблизости нет магазинов.", "<mark>There aren't any</mark> shops near here."],
          ["Сколько комнат в квартире?", "<mark>How many</mark> rooms <mark>are there</mark> in the flat?", "порядок: are there"],
        ]),
        pit(
          `${no("There are not any shop.")} ${yes("There isn't a shop.")} ${yes("There aren't any shops.")}`,
          `В вопросе there идёт после is / are: ${no("There is a bank near here?")} ${yes("Is there a bank near here?")}`,
          `В коротком ответе есть there: ${no("Yes, it is.")} ${yes("Yes, there is.")}`
        ),
        link("Урок 3, тема 2: any в отрицаниях · Урок 6, тема 5: much и many")
      ),
      groups: [
        group("Выберите правильный вариант", [
          ch("___ any milk in the fridge?", ["Is there", "Are there", "There is"], "Is there", "milk не считается → Is there."),
          ch("___ any good restaurants in your town?", ["Is there", "Are there"], "Are there", "restaurants → Are there."),
          ch("There ___ any children in the park.", ["isn't", "aren't"], "aren't", "children — несколько → aren't."),
          ch("Is there a lift in the building? — No, ___.", ["there isn't", "it isn't", "there aren't"], "there isn't", "No, there isn't."),
          ch("There are ___ nice cafés in this street.", ["some", "any", "a"], "some", "Утверждение → some."),
          ch("There isn't ___ sugar in my tea.", ["some", "any", "a"], "any", "Отрицание → any."),
        ]),
        group("Сделайте отрицание и вопрос", [
          inp("There is a park near here.", ["There isn't a park near here.", "There is not a park near here."], "is → isn't.", "Сделайте отрицание"),
          inp("There are some shops in this street.", ["There aren't any shops in this street.", "There are not any shops in this street."], "some → any в отрицании.", "Сделайте отрицание"),
          inp("There is a pharmacy near here.", ["Is there a pharmacy near here?"], "Is + there + a pharmacy…?", "Превратите в вопрос"),
          inp("There are some buses at night.", ["Are there any buses at night?"], "В вопросе some → any: Are there any buses…?", "Превратите в вопрос"),
        ]),
        group("Нажмите на неправильное слово", [
          fix("There is two beds in the room.", "is", "are", "two beds → are."),
          fix("Are there some cafés near here?", "some", "any", "В вопросе → any."),
          fix("Is there a bank? — Yes, it is.", "it", "there", "Короткий ответ: Yes, there is."),
        ]),
      ],
    },
    {
      id: "where", nav: "Предлоги места", eyebrow: "Тема 3 · где именно", title: "in, on, under, next to, between",
      theory: html(
        table(["Предлог", "Значение", "Пример"], [
          ["<mark>in</mark>", "в, внутри", "The keys are in my bag."],
          ["<mark>on</mark>", "на поверхности", "The book is on the table."],
          ["<mark>under</mark>", "под", "The cat is under the chair."],
          ["<mark>next to</mark>", "рядом с", "The bank is next to the café."],
          ["<mark>between</mark>", "между", "The shop is between the bank and the park."],
          ["<mark>behind</mark>", "за, позади", "The garden is behind the house."],
          ["<mark>in front of</mark>", "перед", "There's a car in front of the house."],
          ["<mark>opposite</mark>", "напротив", "The pharmacy is opposite the school."],
          ["<mark>near</mark>", "недалеко от", "I live near the station."],
        ]),
        p("В уроке 1 уже были <b>above</b> — над и <b>below</b> — под, а в теме 12 того же урока — <b>on the left</b> и <b>on the right</b>."),
        examples([
          ["Кот под столом.", "The cat is <mark>under</mark> the table."],
          ["Между банком и аптекой есть кафе.", "There's a café <mark>between</mark> the bank and the pharmacy.", "between … and …"],
          ["Напротив дома есть парк.", "There's a park <mark>opposite</mark> my house."],
        ]),
        pit(
          `next to — всегда с to: ${no("The bank is next the café.")} ${yes("The bank is next to the café.")}`,
          `in front of — «перед», а не «напротив»: напротив — ${yes("opposite")}`,
          `Не путайте in и on: ${yes("in the box")} — внутри, ${yes("on the box")} — сверху`
        ),
        link("Урок 1, темы 7 и 12: above, below, on the left, on the right · Урок 4: at / on / in — но там про время")
      ),
      groups: [
        group("Выберите предлог", [
          ch("The milk is ___ the fridge.", ["in", "on", "under"], "in", "Внутри холодильника → in."),
          ch("Your phone is ___ the table.", ["in", "on", "between"], "on", "На поверхности → on."),
          ch("The shoes are ___ the bed.", ["under", "on", "next"], "under", "Под кроватью → under."),
          ch("The café is ___ the bank.", ["next to", "next", "near to"], "next to", "next to — рядом с."),
          ch("The school is ___ the park and the shop.", ["between", "next to", "behind"], "between", "Между двумя → between."),
          ch("There's a bus stop ___ my house. I can see it from the window.", ["in front of", "in", "under"], "in front of", "Перед домом → in front of."),
          ch("The pharmacy is ___ the supermarket, on the other side of the street.", ["opposite", "behind", "in"], "opposite", "Напротив → opposite."),
        ]),
        group("Опишите комнату", [
          inp("(there / a lamp / on / the table)", ["There is a lamp on the table.", "There's a lamp on the table."], "There is + a lamp + on the table.", "Составьте предложение"),
          inp("(the cat / under / the chair)", ["The cat is under the chair."], "The cat + is + under the chair.", "Составьте предложение"),
          inp("(there / two windows / in / the kitchen)", ["There are two windows in the kitchen."], "two windows → There are.", "Составьте предложение"),
        ]),
      ],
    },
    {
      id: "home", nav: "Дом и город", eyebrow: "Тема 4 · лексика", title: "Комнаты, мебель и места в городе",
      theory: html(
        ng(
          ["Комнаты", ["flat — квартира", "house — дом", "room — комната", "kitchen — кухня", "bedroom — спальня", "bathroom — ванная", "living room — гостиная", "hall — прихожая", "balcony — балкон", "garden — сад"]],
          ["Мебель и вещи", ["table — стол", "chair — стул", "bed — кровать", "sofa — диван", "wardrobe — шкаф", "fridge — холодильник", "cooker — плита", "shower — душ", "lamp — лампа", "mirror — зеркало"]]
        ),
        ng(
          ["Места в городе", ["shop — магазин", "supermarket — супермаркет", "pharmacy / chemist's — аптека", "bank — банк", "post office — почта", "station — вокзал, станция", "bus stop — остановка"]],
          ["Куда ходят", ["café — кафе", "restaurant — ресторан", "cinema — кинотеатр", "museum — музей", "park — парк", "gym — спортзал", "school — школа"]]
        ),
        h3("Как спросить дорогу и рассказать о доме"),
        examples([
          ["Тут рядом есть аптека?", "<mark>Is there</mark> a pharmacy <mark>near here</mark>?"],
          ["Да, напротив вокзала.", "Yes, <mark>opposite</mark> the station."],
          ["Я живу в квартире с двумя спальнями.", "I live in a flat <mark>with</mark> two bedrooms."],
          ["В гостиной есть большой диван.", "There's a big sofa in the <mark>living room</mark>."],
        ]),
        pit(
          `flat — квартира (брит.), apartment — амер. Оба верны.`,
          `«живу в доме» — ${yes("I live in a house.")}, а «дома» без предлога — ${yes("I'm at home.")}`
        ),
        link("Урок 2: вещи, которые мы носим с собой · Урок 5: распорядок дня — там же go home, get home")
      ),
      groups: [
        group("Выберите слово", [
          ch("«кухня» — ___", ["kitchen", "bathroom", "bedroom"], "kitchen", "kitchen — кухня."),
          ch("«спальня» — ___", ["bedroom", "living room", "hall"], "bedroom", "bedroom — спальня."),
          ch("«холодильник» — ___", ["fridge", "cooker", "wardrobe"], "fridge", "fridge — холодильник."),
          ch("«аптека» — ___", ["pharmacy", "post office", "station"], "pharmacy", "pharmacy — аптека."),
          ch("«шкаф для одежды» — ___", ["wardrobe", "sofa", "mirror"], "wardrobe", "wardrobe — шкаф для одежды."),
          ch("«остановка автобуса» — ___", ["bus stop", "station", "bus station"], "bus stop", "bus stop — остановка."),
        ]),
        group("Расскажите о доме и районе", [
          inp("(there / a balcony / in my flat)", ["There is a balcony in my flat.", "There's a balcony in my flat."], "There is + a balcony.", "Составьте предложение"),
          inp("(is / there / a supermarket / near here?)", ["Is there a supermarket near here?"], "Is + there + a supermarket + near here?", "Составьте вопрос"),
          inp("«В моей квартире три комнаты.»", ["There are three rooms in my flat.", "My flat has three rooms.", "There are three rooms in my apartment."], "three rooms → There are.", "Переведите на английский"),
        ]),
      ],
    },
    {
      id: "final", nav: "Итоговый тест", eyebrow: "Итоговый тест · все темы вперемешку", title: "Проверьте себя",
      theory: p("Все темы урока вперемешку. Если ошибётесь, вернитесь к объяснению нужной темы через меню сверху."),
      groups: [
        group("Смешанные задания", [
          ch("___ a new café in our street.", ["There is", "There are", "It is"], "There is", "Тема 1: a café → There is."),
          ch("___ five people in the room.", ["There is", "There are"], "There are", "Тема 1: five people → There are."),
          ch("There ___ any milk in the fridge.", ["isn't", "aren't"], "isn't", "Тема 2: milk не считается → isn't."),
          inp("There are some chairs in the hall.", ["There aren't any chairs in the hall.", "There are not any chairs in the hall."], "Тема 2: some → any в отрицании.", "Сделайте отрицание"),
          ch("Is there a bank near here? — Yes, ___.", ["there is", "it is", "there are"], "there is", "Тема 2: Yes, there is."),
          ch("The keys are ___ my bag.", ["in", "on", "under"], "in", "Тема 3: внутри → in."),
          ch("The park is ___ the school and the station.", ["between", "next", "in front"], "between", "Тема 3: между двумя → between."),
          ch("«гостиная» — ___", ["living room", "bedroom", "hall"], "living room", "Тема 4: living room."),
          ord("Is there a pharmacy near here?", "Тема 2: Is + there + a pharmacy + near here?"),
          fix("There is two bedrooms in my flat.", "is", "are", "Тема 1: two bedrooms → are."),
          inp("«На столе есть лампа.»", ["There is a lamp on the table.", "There's a lamp on the table."], "Тема 1 и 3: There is + on the table.", "Переведите на английский"),
          ch("There's a car ___ the house. I can see it from the window.", ["in front of", "opposite", "under"], "in front of", "Тема 3: перед домом → in front of."),
        ]),
      ],
    },
  ],
};

extend(lesson, "where", null, group("Переведите на английский", [
  inp("«Ключи в сумке.»", ["The keys are in the bag.", "The keys are in my bag."], "keys → are + in.", "Переведите на английский"),
  inp("«Кафе рядом с банком.»", ["The café is next to the bank.", "The cafe is next to the bank."], "next to.", "Переведите на английский"),
  inp("«Перед домом есть парк.»", ["There is a park in front of the house.", "There's a park in front of the house."], "There is + in front of.", "Переведите на английский"),
]));
extend(lesson, "home", null, group("Ещё слова", [
  ch("«ванная» — ___", ["bathroom", "bedroom", "kitchen"], "bathroom", "bathroom — ванная."),
  ch("«вокзал» — ___", ["station", "bus stop", "post office"], "station", "station — вокзал."),
  ch("«зеркало» — ___", ["mirror", "lamp", "cooker"], "mirror", "mirror — зеркало."),
  ch("«сад» — ___", ["garden", "hall", "balcony"], "garden", "garden — сад."),
  ch("Where do you sleep? — In the ___.", ["bedroom", "kitchen", "hall"], "bedroom", "Спим в спальне."),
]));

export default lesson;
