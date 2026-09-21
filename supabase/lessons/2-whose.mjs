import { ch, inp, fix, ord, group, formula, table, examples, pit, no, yes, sticky, h3, p, compare, ng, html, extend } from "./_helpers.mjs";

const lesson = {
  slug: "whose",
  title: "Чьё это? Вещи и принадлежность",
  subtitle: "вещи, this / these / that / those, my / mine, whose, 's",
  position: 2,
  sections: [
    {
      id: "things", nav: "Вещи", eyebrow: "Тема 1 · лексика", title: "Вещи, которые мы носим с собой",
      theory: html(
        p("Слова из урока «After the party» и с ваших стикеров: что обычно лежит в сумке, в кармане и дома."),
        ng(
          ["В сумке и в кармане", ["wallet — кошелёк (для денег и карт)", "purse — кошелёчек, женский кошелёк", "keys — ключи", "phone charger — зарядка для телефона", "driving licence — водительские права", "notebook — блокнот, тетрадь", "laptop — ноутбук", "hairbrush — расчёска", "make-up — косметика"]],
          ["Одежда и украшения", ["cap — кепка", "scarf — шарф", "gloves — перчатки", "sweater — свитер", "handbag — дамская сумка", "necklace — ожерелье, цепочка", "earrings — серьги", "sunglasses — солнцезащитные очки", "a present / a gift — подарок"]]
        ),
        h3("Одна вещь или пара"),
        p("Некоторые вещи по-английски всегда во множественном числе, потому что состоят из двух частей: <b>gloves, earrings, sunglasses, glasses, keys</b>. С ними — <b>are, these, those, they</b>."),
        examples([
          ["Это мои перчатки.", "These <mark>are</mark> my gloves.", "gloves — несколько → are"],
          ["Где мои очки?", "Where <mark>are</mark> my sunglasses?", "sunglasses → они → are"],
          ["Этот шарф новый.", "This scarf <mark>is</mark> new.", "scarf — одна вещь → is"],
        ]),
        pit(
          `Пишется hairb<b>r</b>u<b>sh</b>: ${no("hairbrash")} ${yes("hairbrush")}`,
          `licence — британское написание, license — американское. Оба варианта правильные, в учебнике — ${yes("driving licence")}`
        ),
        sticky("wallet · bag · keys · driving license · (sun)glasses · phone · gift / present · laptop")
      ),
      groups: [
        group("Выберите слово", [
          ch("«кошелёк» — ___", ["wallet", "necklace", "notebook"], "wallet", "wallet — кошелёк. necklace — ожерелье, notebook — блокнот."),
          ch("«перчатки» — ___", ["gloves", "scarf", "sweater"], "gloves", "gloves — перчатки. Всегда во множественном числе."),
          ch("«зарядка для телефона» — ___", ["phone charger", "phone cap", "phone licence"], "phone charger", "charge — заряжать, charger — зарядка."),
          ch("«водительские права» — ___", ["driving licence", "driver paper", "car licence"], "driving licence", "driving licence (брит.) = driver's license (амер.)."),
          ch("«серьги» — ___", ["earrings", "rings", "necklace"], "earrings", "ear — ухо + rings — кольца = earrings."),
          ch("«расчёска» — ___", ["hairbrush", "hairbrash", "make-up"], "hairbrush", "hair — волосы, brush — щётка."),
        ]),
        group("Соберите слово из букв (как в домашнем задании)", [
          inp("supre →", "purse", "supre → purse.", "Переставьте буквы", "Пять букв, начинается на p."),
          inp("fracs →", "scarf", "fracs → scarf.", "Переставьте буквы", "Начинается на s."),
          inp("wearset →", "sweater", "wearset → sweater.", "Переставьте буквы", "Одежда, начинается на sw."),
          inp("slogev →", "gloves", "slogev → gloves.", "Переставьте буквы", "Начинается на g."),
          inp("ringsear →", "earrings", "ringsear → earrings.", "Переставьте буквы", "ear + rings."),
          inp("klecenca →", "necklace", "klecenca → necklace.", "Переставьте буквы", "neck — шея."),
        ]),
        group("is или are?", [
          ch("These gloves ___ very warm.", ["is", "are"], "are", "gloves — несколько → are."),
          ch("My sunglasses ___ in the car.", ["is", "are"], "are", "sunglasses всегда во множественном числе → are."),
          ch("This necklace ___ a present from my mum.", ["is", "are"], "is", "necklace — одна вещь → is."),
          ch("Your keys ___ on the table.", ["is", "are"], "are", "keys — несколько → are."),
        ]),
      ],
    },
    {
      id: "this", nav: "this · these", eyebrow: "Тема 2 · указательные слова", title: "this, these, that, those",
      theory: html(
        p("Выбор зависит от двух вещей: <b>близко или далеко</b> и <b>один предмет или несколько</b>."),
        table(["", "Один предмет", "Несколько предметов"], [
          ["<b>Близко</b> (здесь, в руке)", "<mark>this</mark> — это, этот", "<mark>these</mark> — эти"],
          ["<b>Далеко</b> (там)", "<mark>that</mark> — то, тот", "<mark>those</mark> — те"],
        ]),
        examples([
          ["Это мой телефон (у меня в руке).", "<mark>This</mark> is my phone."],
          ["Эти ключи твои?", "Are <mark>these</mark> your keys?", "these + are"],
          ["Та сумка очень красивая.", "<mark>That</mark> bag is very nice.", "далеко, одна"],
          ["Те перчатки не мои.", "<mark>Those</mark> gloves aren't mine.", "далеко, несколько"],
        ]),
        p("После <b>this / that</b> — <b>is</b>. После <b>these / those</b> — <b>are</b>."),
        pit(
          `Во множественном числе меняется и слово, и глагол: ${no("This are my keys.")} ${yes("These are my keys.")}`,
          `По-русски «это мои ключи», но по-английски не this: ${no("This is my keys.")} ${yes("These are my keys.")}`
        ),
        sticky("this – these · that – those (это – эти / тот – те)")
      ),
      groups: [
        group("Выберите слово", [
          ch("___ is my new laptop. (у вас в руках)", ["This", "These", "Those"], "This", "Близко и один предмет → this."),
          ch("___ are my earrings. (у вас в руке)", ["This", "These", "That"], "These", "Близко и несколько → these.", { This: "earrings — несколько, поэтому these.", That: "That — для одного и далеко." }),
          ch("Look at ___ man over there!", ["this", "that", "those"], "that", "over there — далеко, один человек → that."),
          ch("Whose are ___ bags over there?", ["that", "these", "those"], "those", "Далеко и несколько → those."),
          ch("Is ___ your scarf? (показываете на шарф рядом)", ["this", "these", "those"], "this", "Близко и один → this."),
          ch("___ gloves are too small for me. (они у вас на руках)", ["This", "These", "Those"], "These", "Близко и несколько → these."),
        ]),
        group("Поставьте во множественное число", [
          inp("This is my key.", ["These are my keys."], "this → these, is → are, key → keys.", "Напишите про несколько предметов"),
          inp("That is her bag.", ["Those are her bags."], "that → those, is → are, bag → bags.", "Напишите про несколько предметов"),
          inp("Is this your notebook?", ["Are these your notebooks?"], "Is this → Are these, notebook → notebooks.", "Напишите про несколько предметов"),
        ]),
        group("Нажмите на неправильное слово", [
          fix("This are my sunglasses.", "This", "These", "sunglasses — несколько → These are."),
          fix("Those bag is very expensive.", "Those", "That", "bag — один предмет → That bag is."),
          fix("These shoes is new.", "is", "are", "These shoes → are."),
        ]),
      ],
    },
    {
      id: "my", nav: "my · your", eyebrow: "Тема 3 · притяжательные слова", title: "my, your, his, her… — перед предметом",
      theory: html(
        p("Слова «мой, твой, его…» ставятся <b>перед</b> существительным. Они не меняются по родам и числам: my bag, my keys, my sister."),
        formula("!my · your · his · her · its · our · their", "предмет"),
        table(["Кто", "Чей", "Пример"], [
          ["I", "<mark>my</mark> — мой", "my phone"],
          ["you", "<mark>your</mark> — твой, ваш", "your keys"],
          ["he", "<mark>his</mark> — его (о мужчине)", "his wallet"],
          ["she", "<mark>her</mark> — её", "her handbag"],
          ["it", "<mark>its</mark> — его / её (о предмете, животном)", "its name"],
          ["we", "<mark>our</mark> — наш", "our flat"],
          ["they", "<mark>their</mark> — их", "their car"],
        ]),
        h3("his или her"),
        p("По-русски «его / её» зависит от предмета, а по-английски — от <b>владельца</b>. Сумка Тома — <b>his</b> bag, телефон Анны — <b>her</b> phone."),
        examples([
          ["Анна потеряла свой кошелёк.", "Anna can't find <mark>her</mark> wallet.", "владелец — Анна (she) → her"],
          ["Это машина моего брата. Его машина новая.", "This is my brother's car. <mark>His</mark> car is new.", "владелец — брат (he) → his"],
          ["У собаки есть имя. Её зовут Рекс.", "The dog has a name. <mark>Its</mark> name is Rex.", "владелец — собака (it) → its"],
        ]),
        pit(
          `its (чей?) и it's (= it is) — разные слова. Подробно — в уроке 1, тема 8: ${no("it's name")} ${yes("its name")}`,
          `«Свой» по-английски — тоже my / his / her… : ${no("I love self car.")} ${yes("I love my car.")}`
        ),
        sticky("its name · mother's car = her car · Sasha's birthday = his birthday")
      ),
      groups: [
        group("Выберите слово", [
          ch("Tom, is this ___ jacket?", ["you", "your", "yours"], "your", "Перед предметом (jacket) → your."),
          ch("Maria loves ___ new necklace.", ["his", "her", "their"], "her", "Владелец Maria (she) → her."),
          ch("My brother can't find ___ keys.", ["his", "her", "its"], "his", "Владелец brother (he) → his."),
          ch("We love ___ new flat.", ["our", "their", "your"], "our", "we → our."),
          ch("The company changed ___ logo.", ["it's", "its", "his"], "its", "Компания — it → its. it's = it is."),
          ch("My parents sold ___ car.", ["theirs", "their", "they"], "their", "they → their, перед предметом."),
          ch("I use ___ laptop every day.", ["my", "mine", "me"], "my", "Перед предметом → my."),
        ]),
        group("Замените имя на слово «чей»", [
          inp("This is Anna's bag. → This is ___ bag.", ["her"], "Anna → she → her.", "Впишите одно слово", "Anna — она."),
          inp("Where is Tom's phone? → Where is ___ phone?", ["his"], "Tom → he → his.", "Впишите одно слово", "Tom — он."),
          inp("Jack and Linda's house is big. → ___ house is big.", ["Their"], "Jack and Linda → they → their.", "Впишите одно слово", "Они."),
          inp("The cat's bowl is empty. → ___ bowl is empty.", ["Its"], "cat → it → its (без апострофа).", "Впишите одно слово", "Кошка — it."),
        ]),
      ],
    },
    {
      id: "mine", nav: "mine · yours", eyebrow: "Тема 4 · притяжательные слова", title: "mine, yours, hers… — без предмета",
      theory: html(
        p("Когда предмет уже понятен и мы его не повторяем, вместо <b>my / your…</b> говорим <b>mine / yours…</b>. После них существительного <b>нет</b>."),
        compare(
          ["It's my house.", "Это мой дом.", "my + предмет"],
          ["This house is mine.", "Этот дом — мой.", "mine в конце, без предмета"]
        ),
        table(["Перед предметом", "Без предмета", "Пример"], [
          ["my", "<mark>mine</mark>", "The phone is mine."],
          ["your", "<mark>yours</mark>", "Is this sweater yours?"],
          ["his", "<mark>his</mark>", "The cap is his."],
          ["her", "<mark>hers</mark>", "They're hers."],
          ["our", "<mark>ours</mark>", "That charger is ours."],
          ["their", "<mark>theirs</mark>", "Those gloves are theirs."],
        ]),
        p("Запомнить просто: почти везде добавляется <b>-s</b> (yours, hers, ours, theirs). Исключения: <b>mine</b> и <b>his</b> (не меняется)."),
        examples([
          ["— Это твоя кепка? — Да, моя.", "— Is this your cap? — Yes, it's <mark>mine</mark>."],
          ["Эти серьги её.", "These earrings are <mark>hers</mark>.", "her earrings → hers"],
          ["Моя кепка здесь, а твоя там.", "My cap is here, but <mark>yours</mark> is there.", "yours = your cap"],
        ]),
        pit(
          `Апострофа нет: ${no("your's, her's, their's")} ${yes("yours, hers, theirs")}`,
          `Не путайте форму: ${no("Is this sweater your?")} ${yes("Is this sweater yours?")}`,
          `После mine / yours предмет не ставится: ${no("It's mine car.")} ${yes("It's my car.")} или ${yes("The car is mine.")}`
        ),
        sticky("It's my house. This is his idea. · It's my house — this house is mine")
      ),
      groups: [
        group("Выберите правильный вариант", [
          ch("Is this sweater ___?", ["your", "yours", "you"], "yours", "После слова «чей» нет предмета → yours.", { your: "your нужен только перед предметом: your sweater." }),
          ch("A: That's my notebook. B: No, it isn't. It's ___!", ["my", "mine", "me"], "mine", "В конце, без предмета → mine."),
          ch("These gloves are ___. (she)", ["her", "hers", "she's"], "hers", "she → hers."),
          ch("Whose driving licence is this? — It's ___. (he)", ["his", "him", "he's"], "his", "he → his (не меняется)."),
          ch("That phone charger is ___. (we)", ["our", "ours", "us"], "ours", "we → ours."),
          ch("Are those earrings ___? (they)", ["their", "theirs", "them"], "theirs", "they → theirs."),
          ch("This cap is mine, but that one's ___.", ["your", "yours", "you're"], "yours", "that one = та кепка, предмета после слова нет → yours."),
        ]),
        group("Перепишите с mine, yours, hers… (как в домашнем задании)", [
          inp("They're Janice's earrings.", ["They're hers.", "They are hers."], "Janice → she → hers.", "Замените с помощью hers, his, theirs…"),
          inp("That's James's skateboard.", ["That's his.", "That is his.", "It's his."], "James → he → his.", "Замените с помощью hers, his, theirs…"),
          inp("Is this your cap?", ["Is this yours?", "Is it yours?"], "your cap → yours.", "Замените с помощью hers, his, theirs…"),
          inp("It's Kate and Nathan's phone number.", ["It's theirs.", "It is theirs."], "Kate and Nathan → they → theirs.", "Замените с помощью hers, his, theirs…"),
          inp("Are these my books?", ["Are these mine?", "Are they mine?"], "my books → mine.", "Замените с помощью hers, his, theirs…"),
          inp("It's Fiona's handbag.", ["It's hers.", "It is hers."], "Fiona → she → hers.", "Замените с помощью hers, his, theirs…"),
          inp("Are they our sandwiches?", ["Are they ours?", "Are these ours?"], "our sandwiches → ours.", "Замените с помощью hers, his, theirs…"),
        ]),
        group("Нажмите на неправильное слово", [
          fix("Is this sweater your?", "your", "yours", "В конце, без предмета → yours."),
          fix("These gloves are my.", "my", "mine", "Без предмета → mine."),
          fix("This make-up is they're.", "they're", "theirs", "they're = they are. «Их» без предмета → theirs."),
          fix("These notebooks are their.", "their", "theirs", "Без предмета → theirs."),
        ]),
      ],
    },
    {
      id: "whose", nav: "whose · 's", eyebrow: "Тема 5 · вопрос и ответ", title: "Whose is it? — Чьё это? It's Harry's.",
      theory: html(
        h3("Whose — чей?"),
        formula("!Whose", "(предмет)", "is · are", "this / these…", "?"),
        examples([
          ["Чья это кепка?", "<mark>Whose</mark> cap is this?", "один предмет → is"],
          ["Чьи это наушники?", "<mark>Whose</mark> headphones are these?", "несколько → are"],
          ["Чьё это?", "<mark>Whose</mark> is it?", "предмет можно не называть"],
        ]),
        h3("'s — принадлежность человеку"),
        p("Вместо «блокнот Гарри» говорим «Гарри's блокнот»: <b>имя + 's + предмет</b>."),
        table(["Кому принадлежит", "Как сказать", "Пример"], [
          ["одному человеку", "имя + <mark>'s</mark>", "Harry<mark>'s</mark> notebook · my mother<mark>'s</mark> car"],
          ["двум людям вместе", "'s только у последнего", "Harry and Sally<mark>'s</mark> flat"],
          ["слову на -s во мн. числе", "только апостроф <mark>'</mark>", "my parent<mark>s'</mark> car"],
        ]),
        examples([
          ["— Чей это блокнот? — Гарри.", "— Whose notebook is this? — It's <mark>Harry's</mark>.", "в ответе предмет не повторяем"],
          ["Сегодня день рождения Саши.", "It's <mark>Sasha's</mark> birthday today.", "= his birthday"],
          ["Машина мамы — её машина.", "My <mark>mother's</mark> car = her car"],
        ]),
        pit(
          `Whose (чей?) и Who's (= Who is, кто?) звучат одинаково: ${no("Who's wallet is this?")} ${yes("Whose wallet is this?")}`,
          `Без апострофа получается «много Салли»: ${no("Those earrings are Sallys.")} ${yes("Those earrings are Sally's.")}`,
          `Не переводите «of»: ${no("the car of my mother")} ${yes("my mother's car")}`
        ),
        sticky("Whose is it? Whose — чей? · 's: mother's car = her car · Sasha's birthday = his birthday")
      ),
      groups: [
        group("Выберите правильный вариант", [
          ch("___ earrings are these?", ["Who", "Whose", "Who's"], "Whose", "Чьи? → Whose.", { Who: "Who — кто. Нужно «чьи» → Whose.", "Who's": "Who's = Who is. Нужно Whose." }),
          ch("Whose notebook ___ this?", ["is", "are"], "is", "notebook — один → is."),
          ch("Whose gloves ___ these?", ["is", "are"], "are", "gloves — несколько → are."),
          ch("A: Whose phone charger is this? B: It's ___.", ["Anna", "Anna's", "Annas"], "Anna's", "Принадлежит Анне → Anna's."),
          ch("It's my ___ car.", ["parents'", "parent's", "parents's"], "parents'", "Двое родителей: parents + ' → parents'.", { "parent's": "Так пишут про одного родителя. Родителей двое → parents'.", "parents's": "После -s во множественном числе ставим только апостроф." }),
          ch("This is ___ flat. (Jack and Linda живут вместе)", ["Jack's and Linda's", "Jack and Linda's", "Jack and Lindas"], "Jack and Linda's", "Общая квартира → 's только у последнего имени."),
        ]),
        group("Задайте вопрос с whose", [
          inp("(this / cap)", ["Whose cap is this?", "Whose is this cap?"], "Whose + cap + is + this?", "Спросите: «Чья это кепка?»"),
          inp("(these / keys)", ["Whose keys are these?", "Whose are these keys?"], "keys — несколько → are these.", "Спросите: «Чьи это ключи?»"),
          inp("(that / laptop)", ["Whose laptop is that?", "Whose is that laptop?"], "Whose + laptop + is + that?", "Спросите: «Чей вон тот ноутбук?»"),
        ]),
        group("Соберите предложение", [
          ord("Whose sweater is this?", "Whose + sweater + is + this?", ["Whose is this sweater?"]),
          ord("This notebook is Harry's.", "Предмет + is + Harry's.", [], ["Harry's"]),
          ord("It's my mother's car.", "my mother's + car."),
          ord("Are these gloves yours?", "Are + these gloves + yours?"),
        ]),
        group("Нажмите на неправильное слово", [
          fix("Who's wallet is this?", "Who's", "Whose", "Чей? → Whose. Who's = Who is."),
          fix("Those earrings are Sallys.", "Sallys", "Sally's", "Принадлежность → апостроф: Sally's."),
          fix("Whose necklace are this?", "are", "is", "necklace — один предмет → is."),
        ]),
      ],
    },
    {
      id: "words", nav: "Фразы с доски", eyebrow: "Тема 6 · фразы со стикеров", title: "Фразы с ваших стикеров",
      theory: html(
        h3("inside / outside — внутри / снаружи"),
        examples([
          ["Бабушка на улице.", "My grandma <mark>is outside</mark>.", "to be outside — быть снаружи, на улице"],
          ["Давай останемся в доме, идёт дождь.", "Let's stay <mark>inside</mark>. It's raining.", "inside — внутри, в помещении"],
        ]),
        h3("pleasant / unpleasant — приятный / неприятный"),
        p("Приставка <b>un-</b> делает слово противоположным: pleasant → <b>un</b>pleasant, comfortable → <b>un</b>comfortable, happy → <b>un</b>happy."),
        examples([
          ["Наш сосед очень приятный.", "Our neighbour is very <mark>pleasant</mark>.", "pleasant — приятный"],
          ["Погода сегодня неприятная.", "The weather is <mark>unpleasant</mark> today.", "un + pleasant"],
        ]),
        h3("pleased — рад, доволен"),
        p("Из текста про вечеринку: <b>I'm really pleased</b> — я очень рада. Это состояние человека, поэтому с to be: I'm pleased, she is pleased."),
        h3("which = what — какой, который"),
        p("<b>Which</b> — когда выбираем из небольшого числа вариантов: <b>Which</b> objects do they mention? — Какие вещи (из списка) они называют?"),
        sticky("to be outside · to be inside · pleasant / unpleasant · which = what")
      ),
      groups: [
        group("Выберите правильный вариант", [
          ch("It's cold. Let's stay ___.", ["inside", "outside", "unpleasant"], "inside", "Холодно — останемся внутри: inside."),
          ch("The children are ___ in the garden.", ["inside", "outside"], "outside", "in the garden — на улице → outside."),
          ch("The opposite of «pleasant» is ___.", ["unpleasant", "displeasant", "nopleasant"], "unpleasant", "un + pleasant."),
          ch("«Я очень рада.» — I'm really ___.", ["pleased", "pleasant", "please"], "pleased", "pleased — рад (о человеке). pleasant — приятный (о чём-то)."),
          ch("___ bag is yours, the red one or the black one?", ["Which", "Who", "Whose"], "Which", "Выбор из двух вариантов → Which."),
        ]),
      ],
    },
    {
      id: "final", nav: "Итоговый тест", eyebrow: "Итоговый тест · все темы вперемешку", title: "Проверьте себя",
      theory: p("Все темы урока вперемешку. Если ошибётесь, вернитесь к объяснению нужной темы через меню сверху."),
      groups: [
        group("Смешанные задания", [
          ch("___ are my new sunglasses.", ["This", "These", "That"], "These", "Тема 2: sunglasses — несколько, близко → These."),
          ch("Is that bag ___?", ["your", "yours", "you"], "yours", "Тема 4: без предмета → yours."),
          ch("___ keys are these?", ["Who's", "Whose", "Who"], "Whose", "Тема 5: чьи? → Whose."),
          inp("Anna's scarf → ___ scarf", ["her"], "Тема 3: Anna → her.", "Впишите одно слово", "Anna — она."),
          fix("This is my brother car.", "brother", "brother's", "Тема 5: принадлежность → brother's."),
          ch("My gloves ___ in my bag.", ["is", "are"], "are", "Тема 1: gloves — несколько → are."),
          inp("These are Tom's shoes.", ["These are his.", "They're his.", "They are his."], "Тема 4: Tom → his.", "Замените с помощью his, hers, theirs…"),
          ord("Whose phone charger is that?", "Тема 5: Whose + phone charger + is + that?", ["Whose is that phone charger?"]),
          ch("The dog is hungry. ___ bowl is empty.", ["It's", "Its", "His"], "Its", "Тема 3: собака — it → its."),
          fix("Those shoes is very expensive.", "is", "are", "Тема 2: those + are."),
          ch("It's cold ___. Take your scarf.", ["outside", "inside", "pleasant"], "outside", "Тема 6: на улице → outside."),
          inp("This is ___ flat. (Jack and Linda)", ["Jack and Linda's"], "Тема 5: общая квартира → 's у последнего имени.", "Впишите, чья квартира"),
        ]),
      ],
    },
  ],
};

// Added after a second check of the board: the remaining stickies from «After the party».
extend(lesson, "words", html(
  h3("Что взять с собой: слова со стикеров"),
  p("Вы отвечали на вопрос «три вещи, которые всегда берёте с собой»: wallet, phone, a present, a good mood, fresh products, water."),
  examples([
    ["Я всегда в хорошем настроении на праздниках.", "I'm always <mark>in a good mood</mark> at parties.", "в хорошем настроении — in a good mood"],
    ["Я беру с собой хорошее настроение.", "I bring <mark>a good mood</mark> with me.", "a good mood — хорошее настроение"],
    ["В отпуск я беру свежие продукты.", "I take <mark>fresh food</mark> on holiday.", "«продукты» чаще food или groceries; products — товары"],
    ["Возьми воду.", "Take <mark>some water</mark>. / Take <mark>a bottle of water</mark>.", "water нельзя посчитать: не a water, не waters"],
  ]),
  pit(
    `${no("I take a water.")} ${yes("I take some water.")} ${yes("I take a bottle of water.")}`,
    `${no("I'm in good mood.")} ${yes("I'm in a good mood.")}`
  ),
  sticky("wallet / phone / gift / present / good mood · fresh products / daughter / water")
), group("Что взять с собой", [
  ch("«Я сегодня в хорошем настроении.»", ["I'm in a good mood today.", "I'm in good mood today.", "I have a good mood today."], "I'm in a good mood today.", "in a good mood — с a."),
  ch("Can I have ___ water, please?", ["a", "some", "waters"], "some", "water нельзя посчитать → some water."),
  ch("«Я покупаю свежие продукты на рынке.»", ["I buy fresh food at the market.", "I buy fresh products at the market.", "I buy freshs food at the market."], "I buy fresh food at the market.", "Про еду естественнее fresh food. products — скорее «товары»."),
  ch("Don't forget ___ bottle of water!", ["a", "an", "some"], "a", "a bottle of water — бутылку можно посчитать."),
]));

export default lesson;
