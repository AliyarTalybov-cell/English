import { ch, inp, fix, ord, group, formula, table, examples, pit, no, yes, sticky, h3, p, compare, ng, html, extend } from "./_helpers.mjs";
import { addTranslation } from "./translate.mjs";

const link = text => sticky(text, "Связь с курсом");

const lesson = {
  slug: "food-cafe",
  title: "Еда, кафе и покупки",
  subtitle: "что считается и что нет, some / any, I'd like, цены и числа",
  position: 12,
  sections: [
    {
      id: "count", nav: "Что считается", eyebrow: "Тема 1 · еда", title: "an apple, но some bread",
      theory: html(
        p("Еда бывает двух видов. То, что можно посчитать поштучно — <b>an apple, two eggs</b>. То, что считают только мерами — <b>bread, milk, rice</b>: их нельзя сказать «два хлеба», можно «кусок хлеба»."),
        table(["", "Считается", "Не считается"], [
          ["Примеры", "an apple, a banana, eggs, tomatoes, sandwiches", "bread, milk, water, rice, sugar, cheese, meat"],
          ["Один", "<mark>a / an</mark> apple", "нельзя a bread → <mark>some</mark> bread"],
          ["Много", "apple<mark>s</mark>", "форма не меняется: <mark>much</mark> bread"],
          ["Сколько?", "<mark>How many</mark> eggs?", "<mark>How much</mark> milk?"],
        ]),
        h3("Слова для еды"),
        ng(
          ["Считаются", ["an apple — яблоко", "a banana — банан", "an egg — яйцо", "a tomato — помидор", "a sandwich — бутерброд", "a biscuit — печенье", "vegetables — овощи"]],
          ["Не считаются", ["bread — хлеб", "milk — молоко", "water — вода", "juice — сок", "rice — рис", "cheese — сыр", "meat — мясо", "sugar — сахар", "coffee / tea — кофе, чай"]]
        ),
        p("Порции считаются всегда: <b>a cup of</b> coffee, <b>a glass of</b> water, <b>a bottle of</b> juice, <b>a piece of</b> cake."),
        examples([
          ["В холодильнике есть молоко.", "There's <mark>some</mark> milk in the fridge."],
          ["Я съел два яйца и немного хлеба.", "I ate two <mark>eggs</mark> and <mark>some</mark> bread."],
          ["Можно чашку чая?", "Can I have <mark>a cup of</mark> tea?"],
        ]),
        pit(
          `${no("a bread")} ${no("two milks")} ${yes("some bread")} ${yes("two glasses of milk")}`,
          `${no("How much eggs?")} ${yes("How many eggs?")}`,
          `Есть исключение в кафе: ${yes("Can I have a coffee?")} — там имеют в виду «одну чашку».`
        ),
        link("Урок 6, тема 5: much и many · Урок 9, тема 2: some и any")
      ),
      groups: [
        group("Считается или нет?", [
          ch("___ apple", ["an", "some", "a"], "an", "apple начинается с гласного → an."),
          ch("___ bread", ["a", "an", "some"], "some", "bread не считается → some."),
          ch("___ egg", ["an", "some", "much"], "an", "egg считается и начинается с гласного → an."),
          ch("___ water", ["a", "some", "an"], "some", "water не считается → some."),
          ch("How ___ sugar do you take?", ["much", "many"], "much", "sugar не считается → much."),
          ch("How ___ tomatoes do we need?", ["much", "many"], "many", "tomatoes считаются → many."),
        ]),
        group("Выберите правильный вариант", [
          ch("«стакан воды» — ___", ["a glass of water", "a water glass", "some glass water"], "a glass of water", "a glass of + water."),
          ch("«кусок торта» — ___", ["a piece of cake", "a cake piece", "some piece cake"], "a piece of cake", "a piece of + cake."),
          ch("I'd like ___ coffee and two sandwiches.", ["a", "many", "an"], "a", "В кафе a coffee — одна чашка."),
        ]),
      ],
    },
    {
      id: "some", nav: "some · any · a lot of", eyebrow: "Тема 2 · сколько", title: "some, any, a lot of, not much",
      theory: html(
        table(["Слово", "Когда", "Пример"], [
          ["<mark>some</mark>", "утверждение: немного, несколько", "We have some bread."],
          ["<mark>any</mark>", "отрицание и вопрос", "We don't have any bread. · Do we have any bread?"],
          ["<mark>a lot of</mark>", "много — и со считаемым, и с несчитаемым", "There are a lot of people. · I drink a lot of water."],
          ["<mark>not much / not many</mark>", "мало", "I don't eat much meat. · There aren't many shops."],
          ["<mark>a few / a little</mark>", "немного: a few яблок, a little молока", "a few apples · a little milk"],
        ]),
        p("Исключение: в вежливой просьбе и предложении говорят <b>some</b>, даже в вопросе: Can I have <b>some</b> water? Would you like <b>some</b> tea?"),
        examples([
          ["У нас нет молока.", "We don't have <mark>any</mark> milk."],
          ["У меня есть немного времени.", "I have <mark>a little</mark> time."],
          ["В холодильнике много овощей.", "There are <mark>a lot of</mark> vegetables in the fridge."],
          ["Хотите чаю?", "Would you like <mark>some</mark> tea?", "предложение — тоже some"],
        ]),
        pit(
          `${no("I don't have some money.")} ${yes("I don't have any money.")}`,
          `${no("a few milk")} ${yes("a little milk")} — a few только для того, что считается`,
          `«много» в вопросе и отрицании: ${yes("Do you drink much coffee?")} ${yes("I don't eat many sweets.")}`
        ),
        link("Урок 3, тема 2: any · Урок 9, тема 2: some и any с there is")
      ),
      groups: [
        group("Выберите слово", [
          ch("There isn't ___ juice in the bottle.", ["some", "any", "a"], "any", "Отрицание → any."),
          ch("Do we need ___ eggs?", ["some", "any", "a"], "any", "Вопрос → any."),
          ch("I bought ___ cheese and tomatoes.", ["some", "any", "much"], "some", "Утверждение → some."),
          ch("Can I have ___ water, please?", ["some", "any", "many"], "some", "Вежливая просьба → some."),
          ch("She drinks ___ coffee every day.", ["a lot of", "many", "a few"], "a lot of", "coffee не считается → a lot of."),
          ch("I have ___ friends in Moscow.", ["a little", "a few", "much"], "a few", "friends считаются → a few."),
        ]),
        group("Сделайте отрицание", [
          inp("We have some bread.", ["We don't have any bread.", "We do not have any bread."], "some → any в отрицании.", "Сделайте отрицание"),
          inp("There is some milk in the fridge.", ["There isn't any milk in the fridge.", "There is not any milk in the fridge."], "There isn't any milk.", "Сделайте отрицание"),
        ]),
        group("Нажмите на неправильное слово", [
          fix("I don't have some money.", "some", "any", "В отрицании → any."),
          ch("«В стакане немного молока.»", ["There is a little milk in the glass.", "There are a few milk in the glass.", "There is a few milk in the glass."], "There is a little milk in the glass.", "milk не считается → a little, и there is."),
          fix("How much apples do you want?", "much", "many", "apples считаются → many."),
        ]),
      ],
    },
    {
      id: "cafe", nav: "В кафе", eyebrow: "Тема 3 · разговор", title: "I'd like… — заказ в кафе",
      theory: html(
        p("<b>I'd like</b> = I would like — «я бы хотел». Это вежливый способ заказать или попросить. Звучит мягче, чем I want."),
        formula("!I'd like", "что", "please"),
        table(["Фраза", "Перевод"], [
          ["<mark>I'd like</mark> a coffee, please.", "Мне, пожалуйста, кофе."],
          ["<mark>Can I have</mark> the menu, please?", "Можно меню?"],
          ["<mark>Would you like</mark> anything else?", "Хотите что-нибудь ещё?"],
          ["<mark>How much is</mark> it?", "Сколько это стоит?"],
          ["Here you are.", "Вот, пожалуйста."],
          ["That's £4.50.", "С вас 4 фунта 50."],
        ]),
        h3("Как проходит разговор"),
        examples([
          ["— Здравствуйте, что будете?", "— Hello, <mark>what would you like</mark>?"],
          ["— Мне, пожалуйста, чай и бутерброд.", "— <mark>I'd like</mark> a tea and a sandwich, please."],
          ["— Что-нибудь ещё?", "— <mark>Anything else</mark>?"],
          ["— Нет, спасибо. Сколько с меня?", "— No, thanks. <mark>How much is</mark> that?"],
        ]),
        p("После <b>I'd like</b> может идти и глагол — с <b>to</b>: I'd like <b>to</b> book a table. Это отличается от like + -ing из урока 4: I like cooking — вообще люблю, I'd like to cook — хочу сейчас."),
        pit(
          `${no("I'd like a coffee please?")} — это не вопрос, точка в конце: ${yes("I'd like a coffee, please.")}`,
          `${no("I want a coffee.")} — понятно, но невежливо. Лучше ${yes("I'd like a coffee.")}`,
          `${no("I'd like to a coffee.")} ${yes("I'd like a coffee.")} — to нужно только перед глаголом`
        ),
        link("Урок 10, тема 3: Can I have…? · Урок 4, тема 3: like + -ing")
      ),
      groups: [
        group("Выберите правильный вариант", [
          ch("«Мне, пожалуйста, чай.»", ["I'd like a tea, please.", "I like a tea, please.", "I'd like to a tea."], "I'd like a tea, please.", "I'd like + a tea."),
          ch("«Я бы хотел забронировать столик.»", ["I'd like to book a table.", "I'd like book a table.", "I like booking a table."], "I'd like to book a table.", "Перед глаголом — to."),
          ch("— Would you like anything else? — ___", ["No, thanks.", "Yes, I like.", "No, I don't like."], "No, thanks.", "Вежливый отказ: No, thanks."),
          ch("«Сколько это стоит?»", ["How much is it?", "How many is it?", "How much it is?"], "How much is it?", "How much + is + it?"),
          ch("Официант даёт вам заказ и говорит: ___", ["Here you are.", "Here it is you.", "Take you."], "Here you are.", "Here you are — вот, пожалуйста."),
        ]),
        group("Составьте фразу", [
          inp("(I'd like / a coffee and a sandwich)", ["I'd like a coffee and a sandwich.", "I would like a coffee and a sandwich."], "I'd like + a coffee and a sandwich.", "Закажите в кафе"),
          inp("В кафе вы поели и хотите расплатиться.", ["Can I have the bill, please?"], "Can I have + the bill.", "Попросите счёт: «Можно счёт, пожалуйста?»"),
          ord("I'd like a glass of water.", "I'd like + a glass of water."),
        ]),
      ],
    },
    {
      id: "money", nav: "Цены и числа", eyebrow: "Тема 4 · покупки", title: "How much is it? Числа до тысячи",
      theory: html(
        table(["Число", "Слово", "Число", "Слово"], [
          ["60", "sixty", "100", "a hundred"],
          ["70", "seventy", "200", "two hundred"],
          ["80", "eighty", "1 000", "a thousand"],
          ["90", "ninety", "2 500", "two thousand five hundred"],
        ]),
        p("Между сотнями и остатком ставят <b>and</b>: 125 — one hundred <b>and</b> twenty-five. Помните про -teen и -ty из урока 5: thirteen и thirty звучат по-разному."),
        h3("Цены"),
        table(["Вопрос", "Когда"], [
          ["<mark>How much is</mark> this bag?", "один предмет"],
          ["<mark>How much are</mark> these shoes?", "несколько предметов"],
          ["<mark>How much is</mark> that altogether?", "сколько всего"],
        ]),
        examples([
          ["Сколько стоит эта футболка? — 15 фунтов.", "How much is this T-shirt? — It's £15.", "£ — фунт, $ — доллар, € — евро"],
          ["Сколько стоят эти билеты? — По 20 евро каждый.", "How much are the tickets? — €20 each."],
          ["Это слишком дорого.", "That's too expensive.", "too — слишком"],
        ]),
        h3("Слова про покупки"),
        ng(
          ["Магазин", ["shop — магазин", "supermarket — супермаркет", "market — рынок", "bill — счёт", "receipt — чек", "cash — наличные", "card — карта"]],
          ["Оценка", ["cheap — дешёвый", "expensive — дорогой", "free — бесплатный", "each — за штуку", "altogether — всего"]]
        ),
        pit(
          `${no("How much cost this bag?")} ${yes("How much is this bag?")} ${yes("How much does this bag cost?")}`,
          `${no("two hundreds")} ${yes("two hundred")}`,
          `${no("It's very expensive too.")} ${yes("It's too expensive.")} — too ставится перед прилагательным`
        ),
        link("Урок 5, тема 5: числа до 50 · Урок 6, тема 5: How much и How many")
      ),
      groups: [
        group("Числа и цены", [
          inp("70 →", ["seventy"], "70 = seventy.", "Напишите число словами", "Начинается на sev."),
          inp("90 →", ["ninety"], "90 = ninety.", "Напишите число словами", "Начинается на nin."),
          inp("250 →", ["two hundred and fifty", "two hundred fifty"], "two hundred + and + fifty.", "Напишите число словами", "two hundred and…"),
          ch("___ is this jacket? — It's £40.", ["How much", "How many", "How much does"], "How much", "Цена одного предмета → How much is."),
          ch("How much ___ these shoes?", ["is", "are", "do"], "are", "shoes — несколько → are."),
          ch("«Это слишком дорого.»", ["It's too expensive.", "It's expensive too.", "It's very expensive too."], "It's too expensive.", "too — перед прилагательным."),
        ]),
        group("Выберите слово", [
          ch("«наличные» — ___", ["cash", "card", "bill"], "cash", "cash — наличные."),
          ch("«счёт в кафе» — ___", ["bill", "receipt", "cheap"], "bill", "bill — счёт."),
          ch("Эти яблоки по 50 пенсов ___.", ["each", "altogether", "free"], "each", "each — за штуку."),
        ]),
      ],
    },
    {
      id: "final", nav: "Итоговый тест", eyebrow: "Итоговый тест · все темы вперемешку", title: "Проверьте себя",
      theory: p("Все темы урока вперемешку. Если ошибётесь, вернитесь к объяснению нужной темы через меню сверху."),
      groups: [
        group("Смешанные задания", [
          ch("Can I have ___ apple, please?", ["a", "an", "some"], "an", "Тема 1: apple → an."),
          ch("There isn't ___ bread at home.", ["some", "any", "a"], "any", "Тема 2: отрицание → any."),
          ch("How ___ water do you drink every day?", ["much", "many"], "much", "Тема 1: water не считается → much."),
          ch("I have ___ friends here.", ["a little", "a few"], "a few", "Тема 2: friends считаются → a few."),
          ch("«Мне, пожалуйста, сок.»", ["I'd like a juice, please.", "I like a juice please.", "I'd like to a juice."], "I'd like a juice, please.", "Тема 3: I'd like."),
          inp("Вы закончили обед в кафе.", ["Can I have the bill, please?"], "Тема 3: Can I have the bill.", "Попросите счёт: «Можно счёт, пожалуйста?»"),
          ch("How much ___ these tomatoes?", ["is", "are", "does"], "are", "Тема 4: tomatoes → are."),
          inp("80 →", ["eighty"], "Тема 4: 80 = eighty.", "Напишите число словами", "Начинается на eig."),
          fix("How much apples do we need?", "much", "many", "Тема 1: apples считаются → many."),
          ord("I'd like a cup of tea.", "Тема 3: I'd like + a cup of tea."),
          ch("We need ___ milk and three eggs.", ["some", "any", "a"], "some", "Тема 2: утверждение → some."),
          inp("«Сколько стоит эта сумка?»", ["How much is this bag?", "How much does this bag cost?"], "Тема 4: How much is…?", "Переведите на английский"),
        ]),
      ],
    },
  ],
};

extend(lesson, "count", null, group("Ещё слова о еде", [
  ch("«сыр» — ___", ["cheese", "meat", "rice"], "cheese", "cheese — сыр."),
  ch("«овощи» — ___", ["vegetables", "biscuits", "sandwiches"], "vegetables", "vegetables — овощи."),
  ch("«бутылка сока» — ___", ["a bottle of juice", "a juice bottle", "some bottle juice"], "a bottle of juice", "a bottle of + juice."),
  ch("I had two ___ for breakfast.", ["egg", "eggs", "some egg"], "eggs", "two + eggs."),
]));
extend(lesson, "cafe", null, group("Соберите диалог в кафе", [
  inp("— What would you like?", ["I'd like a tea and a piece of cake, please.", "I would like a tea and a piece of cake, please."], "I'd like + a tea and a piece of cake.", "Ответьте: «Мне, пожалуйста, чай и кусок торта.»"),
  inp("— Anything else?", ["No, thanks.", "No, thank you."], "No, thanks.", "Ответьте: «Нет, спасибо.»"),
  inp("Официант принёс заказ.", ["How much is that altogether?", "How much is it altogether?", "How much is that?"], "How much is that altogether?", "Спросите: «Сколько всего?»"),
]));

// «Переведите с русского» goes last in every topic; add new groups below this line so item ids stay the same.
addTranslation(lesson);

export default lesson;
