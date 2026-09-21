// «Текст на слух» at the end of each topic's practice: a short dialogue on the topic's grammar and words.
// The student listens first, translates in their head, then opens the text and, if needed, the translation.
// Keyed by lesson slug and section id; build.mjs puts each entry into its section as `listen`.
// scene — who talks and where (shown before listening); lines — [speaker, English, Russian].
// Only grammar and words of this topic and the earlier ones.

export default {
  "to-be": {
    plus: {
      scene: "Вечеринка. Анна знакомится с Беном",
      lines: [
        ["Anna", "Hi! I'm Anna. I'm from Kazan.", "Привет! Я Анна. Я из Казани."],
        ["Ben", "Hi, Anna! I'm Ben. I'm from London.", "Привет, Анна! Я Бен. Я из Лондона."],
        ["Anna", "This is my sister Kate. She's a nurse.", "Это моя сестра Кейт. Она медсестра."],
        ["Ben", "My mum is a nurse too.", "Моя мама тоже медсестра."],
        ["Kate", "The music is great!", "Музыка отличная!"],
        ["Ben", "Yes, and the pizza is very hot.", "Да, а пицца очень горячая."],
      ],
    },
    neg: {
      scene: "Воскресенье. Мама не может найти Тома",
      lines: [
        ["Mum", "Kate, Tom isn't in his room.", "Кейт, Тома нет в комнате."],
        ["Kate", "He isn't at school. It's Sunday!", "В школе его нет. Сегодня воскресенье!"],
        ["Mum", "And his phone isn't on. I'm worried.", "И телефон у него выключен. Я волнуюсь."],
        ["Kate", "Mum, I'm not worried. He's in the garden.", "Мам, я не волнуюсь. Он в саду."],
        ["Mum", "In the garden? But it isn't warm today!", "В саду? Но сегодня не тепло!"],
        ["Kate", "He's with the dog. They're happy.", "Он с собакой. Они счастливы."],
      ],
    },
    yn: {
      scene: "Подруги обсуждают нового соседа",
      lines: [
        ["Lisa", "Is your new neighbour nice?", "Твой новый сосед приятный?"],
        ["Mia", "Yes, he is. He's very friendly.", "Да. Он очень дружелюбный."],
        ["Lisa", "Is he married?", "Он женат?"],
        ["Mia", "No, he isn't.", "Нет."],
        ["Lisa", "Is he a doctor?", "Он врач?"],
        ["Mia", "No, he isn't. He's a teacher. Why?", "Нет. Он учитель. А что?"],
        ["Lisa", "Is he free on Friday?", "Он свободен в пятницу?"],
      ],
    },
    wh: {
      scene: "Утро. Папа опаздывает на встречу",
      lines: [
        ["Dad", "Where are my glasses?", "Где мои очки?"],
        ["Sophie", "On your head, Dad!", "У тебя на голове, пап!"],
        ["Dad", "Thanks. And where is my phone?", "Спасибо. А где мой телефон?"],
        ["Sophie", "It's in your hand!", "У тебя в руке!"],
        ["Dad", "Oh. What time is it?", "Ой. Который час?"],
        ["Sophie", "It's eight. When is your meeting?", "Восемь. Когда у тебя встреча?"],
        ["Dad", "At eight! Bye!", "В восемь! Пока!"],
      ],
    },
    order: {
      scene: "Двое друзей о работе",
      lines: [
        ["Nick", "I work from home. My office is my kitchen.", "Я работаю из дома. Мой офис — моя кухня."],
        ["Emma", "I work in an office. My boss is always there.", "А я работаю в офисе. Мой начальник всегда там."],
        ["Nick", "My boss is my cat!", "Мой начальник — мой кот!"],
        ["Emma", "I swim in the pool every morning.", "Я каждое утро плаваю в бассейне."],
        ["Nick", "Every morning? It is cold today!", "Каждое утро? Сегодня холодно!"],
        ["Emma", "The pool is warm.", "В бассейне тепло."],
      ],
    },
    nat: {
      scene: "Хостел. Путешественники знакомятся",
      lines: [
        ["Luca", "Hi! I'm Luca. I'm from Rome.", "Привет! Я Лука. Я из Рима."],
        ["Yuki", "Hi, Luca. I'm Yuki. I'm Japanese.", "Привет, Лука. Я Юки. Я японка."],
        ["Luca", "Is this your friend?", "Это твоя подруга?"],
        ["Yuki", "Yes, this is Eva. She's from Amsterdam.", "Да, это Ева. Она из Амстердама."],
        ["Luca", "So she's Dutch! Italian pizza or Japanese sushi for dinner?", "Значит, она голландка! На ужин итальянская пицца или японские суши?"],
        ["Eva", "Both, please!", "И то и другое, пожалуйста!"],
      ],
    },
    words: {
      scene: "Мама расспрашивает дочь о курсах",
      lines: [
        ["Mum", "How is your English course?", "Как твои курсы английского?"],
        ["Lily", "Great! It's a three-month course.", "Отлично! Это трёхмесячный курс."],
        ["Mum", "Is the lesson long?", "Урок длинный?"],
        ["Lily", "It's an hour, but we have a 10-minute break.", "Час, но у нас десятиминутный перерыв."],
        ["Mum", "Is the classroom nice?", "Класс хороший?"],
        ["Lily", "Yes. The clock is above the door. We look at it a lot!", "Да. Часы над дверью. Мы часто на них смотрим!"],
      ],
    },
    similar: {
      scene: "Брат и сестра смотрят в окно",
      lines: [
        ["Max", "Look at that bird! Its wings are blue.", "Посмотри на ту птицу! У неё синие крылья."],
        ["Ella", "It's beautiful!", "Красивая!"],
        ["Max", "I'm interested in birds.", "Я интересуюсь птицами."],
        ["Ella", "Really? Birds are boring.", "Правда? Птицы — это скучно."],
        ["Max", "No! This book about birds is very interesting.", "Нет! Вот эта книга о птицах очень интересная."],
        ["Ella", "It's my birthday tomorrow. Is it a present?", "Завтра мой день рождения. Это подарок?"],
        ["Max", "No, it isn't!", "Нет!"],
      ],
    },
    rus: {
      scene: "Анна звонит брату на работу",
      lines: [
        ["Anna", "Hi! Are you busy?", "Привет! Ты занят?"],
        ["Oleg", "Yes, a little. I'm at work.", "Да, немного. Я на работе."],
        ["Anna", "We aren't at home. We're in a café near your office.", "Мы не дома. Мы в кафе рядом с твоим офисом."],
        ["Oleg", "Great! Where is the café?", "Отлично! Где кафе?"],
        ["Anna", "It's next to the bank. Masha is here too.", "Рядом с банком. Маша тоже здесь."],
        ["Oleg", "I'm hungry. Five minutes!", "Я голодный. Буду через пять минут!"],
      ],
    },
    past: {
      scene: "Зимний вечер. Бабушка звонит Кейт",
      lines: [
        ["Grandma", "Hello, dear! What are you doing?", "Алло, дорогая! Что ты делаешь?"],
        ["Kate", "I'm cooking dinner. Look! It's snowing.", "Готовлю ужин. Смотри! Идёт снег."],
        ["Grandma", "Yes! Are the kids sleeping?", "Да! Дети спят?"],
        ["Kate", "No, they aren't. They're playing in the snow.", "Нет. Они играют в снегу."],
        ["Grandma", "Yesterday was terrible. We were at home all day.", "Вчера было ужасно. Мы весь день были дома."],
        ["Kate", "We were at home too. It was very cold.", "Мы тоже были дома. Было очень холодно."],
      ],
    },
    intro: {
      scene: "Первый день на курсах",
      lines: [
        ["Nick", "Hi, I'm Nick.", "Привет, я Ник."],
        ["Anna", "Hi, Nick. I'm Anna. Nice to meet you.", "Привет, Ник. Я Анна. Приятно познакомиться."],
        ["Nick", "Nice to meet you too. What class are you in?", "Мне тоже. В какой ты группе?"],
        ["Anna", "Class B. This is my friend Olga.", "В группе B. Это моя подруга Ольга."],
        ["Olga", "Hi! I'm interested in photography. And you?", "Привет! Я увлекаюсь фотографией. А ты?"],
        ["Nick", "I'm interested in music. I love the guitar.", "Я увлекаюсь музыкой. Обожаю гитару."],
      ],
    },
    words2: {
      scene: "Турист спрашивает дорогу",
      lines: [
        ["Tourist", "Excuse me, where is the bank?", "Извините, где банк?"],
        ["Woman", "It's on the left, next to the café.", "Слева, рядом с кафе."],
        ["Tourist", "And the gym?", "А спортзал?"],
        ["Woman", "It's above the bank. I go there three times a week.", "Над банком. Я хожу туда три раза в неделю."],
        ["Tourist", "Great! Are you a student?", "Здорово! Вы студентка?"],
        ["Woman", "Yes, I'm a second-year student.", "Да, я на втором курсе."],
      ],
    },
    final: {
      scene: "Незнакомый город. Нужна аптека",
      lines: [
        ["Man", "Excuse me, where is the nearest pharmacy?", "Извините, где ближайшая аптека?"],
        ["Girl", "It's near the bank.", "Рядом с банком."],
        ["Man", "Is it far?", "Это далеко?"],
        ["Girl", "No, it isn't. Are you a tourist?", "Нет. Вы турист?"],
        ["Man", "Yes, I am. I'm from Armenia.", "Да. Я из Армении."],
        ["Girl", "Welcome! The pharmacy is open now.", "Добро пожаловать! Аптека сейчас открыта."],
      ],
    },
  },

  whose: {
    things: {
      scene: "Утро. Мама помогает Тому собраться",
      lines: [
        ["Mum", "Tom, your bag is on the table.", "Том, твоя сумка на столе."],
        ["Tom", "Thanks, Mum. Where are my keys?", "Спасибо, мам. Где мои ключи?"],
        ["Mum", "Your keys are in your bag. And your phone charger.", "Ключи у тебя в сумке. И зарядка для телефона."],
        ["Tom", "And my wallet?", "А кошелёк?"],
        ["Mum", "It's in your jacket.", "В куртке."],
        ["Tom", "And my sunglasses?", "А солнцезащитные очки?"],
        ["Mum", "Tom, it's raining!", "Том, идёт дождь!"],
      ],
    },
    this: {
      scene: "Вокзал. Чьи это сумки?",
      lines: [
        ["Anna", "Excuse me! These are my bags.", "Извините! Это мои сумки."],
        ["Man", "No, these are my bags.", "Нет, это мои сумки."],
        ["Anna", "Look! This is my name on this bag.", "Смотрите! Вот моё имя на этой сумке."],
        ["Man", "Oh, sorry! My bags are those over there.", "Ой, простите! Мои сумки — вон те."],
        ["Anna", "That black bag?", "Та чёрная сумка?"],
        ["Man", "Yes, that one. Sorry!", "Да, та. Извините!"],
      ],
    },
    my: {
      scene: "Семья въезжает в новую квартиру",
      lines: [
        ["Mum", "Kids, this is our new flat!", "Дети, это наша новая квартира!"],
        ["Ben", "Where is my room?", "Где моя комната?"],
        ["Mum", "Your room is on the left.", "Твоя комната слева."],
        ["Lily", "And my room?", "А моя?"],
        ["Mum", "Your room is next to our room.", "Твоя рядом с нашей."],
        ["Ben", "Where is Dad?", "А где папа?"],
        ["Mum", "He's in the car. He can't find his keys again!", "В машине. Опять не может найти свои ключи!"],
      ],
    },
    mine: {
      scene: "Брат и сестра разбирают вещи",
      lines: [
        ["Sam", "Is this sweater yours?", "Этот свитер твой?"],
        ["Kate", "Yes, it's mine!", "Да, мой!"],
        ["Sam", "And these gloves?", "А эти перчатки?"],
        ["Kate", "They're Mum's. They're hers.", "Мамины. Они её."],
        ["Sam", "And this notebook? It's mine!", "А этот блокнот? Он мой!"],
        ["Kate", "No, it isn't yours. It's Dad's. It's his.", "Нет, не твой. Он папин. Он его."],
      ],
    },
    whose: {
      scene: "После урока. Учительница нашла вещи",
      lines: [
        ["Teacher", "Whose phone charger is this?", "Чья это зарядка для телефона?"],
        ["Anna", "It's Nick's.", "Ника."],
        ["Teacher", "And whose earrings are these?", "А чьи это серьги?"],
        ["Anna", "They're Olga's.", "Ольгины."],
        ["Teacher", "And whose cap is this?", "А чья это кепка?"],
        ["Anna", "It's mine! Thank you!", "Моя! Спасибо!"],
      ],
    },
    words: {
      scene: "Холодный день. Мама и дочь",
      lines: [
        ["Mum", "It's cold. Let's stay inside.", "Холодно. Давай останемся дома."],
        ["Mia", "But the children are outside in the garden!", "Но дети на улице, в саду!"],
        ["Mum", "OK. Take a jacket. Which jacket is yours, the red one or the black one?", "Ладно. Возьми куртку. Какая твоя, красная или чёрная?"],
        ["Mia", "The red one is mine.", "Красная — моя."],
        ["Mum", "And the black one?", "А чёрная?"],
        ["Mia", "It's Dad's. It's very big!", "Папина. Она очень большая!"],
      ],
    },
    final: {
      scene: "Кафе. Подруги собираются уходить",
      lines: [
        ["Kate", "Are these your keys?", "Это твои ключи?"],
        ["Lisa", "No, they aren't. My keys are in my bag.", "Нет. Мои ключи в сумке."],
        ["Kate", "Whose keys are they?", "Тогда чьи они?"],
        ["Lisa", "They're Tom's.", "Тома."],
        ["Kate", "And is that bag yours?", "А та сумка твоя?"],
        ["Lisa", "No, it's my sister's. But these are my new sunglasses!", "Нет, сестры. Зато это мои новые солнцезащитные очки!"],
      ],
    },
  },

  "have-got": {
    plus: {
      scene: "Подруги делятся новостями",
      lines: [
        ["Emma", "I've got a new laptop!", "У меня новый ноутбук!"],
        ["Kate", "My sister has got a new necklace.", "А у моей сестры новое ожерелье."],
        ["Emma", "And we've got two cats now!", "А у нас теперь две кошки!"],
        ["Kate", "Two? What are their names?", "Две? Как их зовут?"],
        ["Emma", "Tom and Jerry. Tom has got blue eyes.", "Том и Джерри. У Тома голубые глаза."],
        ["Kate", "And Jerry?", "А у Джерри?"],
        ["Emma", "Jerry has got green eyes.", "А у Джерри зелёные."],
      ],
    },
    neg: {
      scene: "Экзамен. Ник ничего не взял",
      lines: [
        ["Nick", "I haven't got a pen. Can I use yours?", "У меня нет ручки. Можно твою?"],
        ["Anna", "Sorry, I've got one pen.", "Извини, у меня одна ручка."],
        ["Nick", "Oh no. And I haven't got my notebook.", "Ой-ой. И блокнота у меня нет."],
        ["Anna", "Nick! You haven't got a pen, you haven't got a notebook…", "Ник! У тебя нет ручки, нет блокнота…"],
        ["Nick", "But I've got a good head!", "Зато у меня хорошая голова!"],
        ["Anna", "Here, take my pencil.", "Держи мой карандаш."],
      ],
    },
    q: {
      scene: "Анна звонит насчёт квартиры",
      lines: [
        ["Anna", "Hello! I've got some questions about the flat.", "Здравствуйте! У меня несколько вопросов о квартире."],
        ["Man", "Yes, of course.", "Да, конечно."],
        ["Anna", "Has it got a balcony?", "В ней есть балкон?"],
        ["Man", "Yes, it has.", "Да."],
        ["Anna", "Has it got a big kitchen?", "А большая кухня?"],
        ["Man", "No, it hasn't. The kitchen is very small.", "Нет. Кухня очень маленькая."],
        ["Anna", "Have you got any photos?", "У вас есть фотографии?"],
        ["Man", "Yes, I have!", "Да!"],
      ],
    },
    have: {
      scene: "Коллеги в офисе",
      lines: [
        ["Olga", "Do you have a pen?", "У тебя есть ручка?"],
        ["Sam", "Yes, I do. Here you are.", "Да. Держи."],
        ["Olga", "Thanks. Do you have any brothers?", "Спасибо. У тебя есть братья?"],
        ["Sam", "No, I don't. But I've got two sisters.", "Нет. Зато у меня две сестры."],
        ["Olga", "Have they got a car?", "У них есть машина?"],
        ["Sam", "Yes, they have. Why?", "Да. А что?"],
        ["Olga", "I haven't got a car, and my house is far!", "У меня нет машины, а живу я далеко!"],
      ],
    },
    adj: {
      scene: "Магазин. Анна выбирает телефон",
      lines: [
        ["Seller", "This new mobile is small and light.", "Этот новый мобильный маленький и лёгкий."],
        ["Anna", "Is it easy to use?", "Им легко пользоваться?"],
        ["Seller", "Yes, very easy.", "Да, очень."],
        ["Anna", "Good. My old phone is broken.", "Хорошо. Мой старый телефон сломан."],
        ["Seller", "And this phone is cheap!", "И этот телефон недорогой!"],
        ["Anna", "Great! I'll take it.", "Отлично! Беру."],
      ],
    },
    words: {
      scene: "Подруги о Нике",
      lines: [
        ["Anna", "Is your friend Nick a teacher?", "Твой друг Ник учитель?"],
        ["Kate", "No, he's a writer. He writes books.", "Нет, он писатель. Он пишет книги."],
        ["Anna", "Wow! Has he got a laptop?", "Ух ты! У него есть ноутбук?"],
        ["Kate", "Yes, he takes it everywhere.", "Да, он везде берёт его с собой."],
        ["Anna", "Look, my new bag is the same as yours!", "Смотри, моя новая сумка такая же, как у тебя!"],
        ["Kate", "Ha! Everybody is happy today.", "Ха! Сегодня все счастливы."],
      ],
    },
    final: {
      scene: "Сёстры о брате",
      lines: [
        ["Kate", "Our brother has got a new motorbike!", "У нашего брата новый мотоцикл!"],
        ["Anna", "Really? He hasn't got a car.", "Правда? У него же нет машины."],
        ["Kate", "No, he hasn't. But he's got a motorbike now.", "Нет. Зато теперь есть мотоцикл."],
        ["Anna", "Has his wife got a car?", "А у его жены есть машина?"],
        ["Kate", "Yes, she has. And they've got a new cat.", "Да. А ещё у них новая кошка."],
        ["Anna", "A cat on a motorbike?", "Кошка на мотоцикле?"],
      ],
    },
  },

  "present-simple-i-you-we-they": {
    plus: {
      scene: "Новые соседи знакомятся",
      lines: [
        ["Mark", "Hi! We live in flat 5.", "Привет! Мы живём в пятой квартире."],
        ["Olga", "Hi! I live in flat 6.", "Привет! А я в шестой."],
        ["Mark", "My wife and I work in a bank.", "Мы с женой работаем в банке."],
        ["Olga", "I work from home. I'm a teacher.", "А я работаю из дома. Я учитель."],
        ["Mark", "We play tennis on Sundays.", "По воскресеньям мы играем в теннис."],
        ["Olga", "I play tennis too!", "Я тоже играю в теннис!"],
      ],
    },
    neg: {
      scene: "Первое свидание",
      lines: [
        ["Anna", "Do you drink coffee?", "Ты пьёшь кофе?"],
        ["Max", "No, I don't. I drink tea.", "Нет. Я пью чай."],
        ["Anna", "Do you play the guitar?", "Ты играешь на гитаре?"],
        ["Max", "Yes, I do. And you?", "Да. А ты?"],
        ["Anna", "I don't play the guitar. But I sing!", "Я не играю на гитаре. Зато я пою!"],
        ["Max", "Do you sing in English?", "По-английски поёшь?"],
        ["Anna", "Yes, I do!", "Да!"],
      ],
    },
    free: {
      scene: "Подруги о свободном времени",
      lines: [
        ["Kate", "What do you do in your free time?", "Что ты делаешь в свободное время?"],
        ["Mia", "I read and go online. And you?", "Читаю и сижу в интернете. А ты?"],
        ["Kate", "I meet friends on Saturdays.", "По субботам встречаюсь с друзьями."],
        ["Mia", "What do you do?", "И что вы делаете?"],
        ["Kate", "We watch sport on TV and eat pizza.", "Смотрим спорт по телевизору и едим пиццу."],
        ["Mia", "I love pizza! And sport!", "Обожаю пиццу! И спорт!"],
      ],
    },
    often: {
      scene: "На приёме у врача",
      lines: [
        ["Doctor", "Do you drink coffee?", "Вы пьёте кофе?"],
        ["Man", "Yes, I always drink coffee in the morning.", "Да, я всегда пью кофе утром."],
        ["Doctor", "Do you eat fish?", "Вы едите рыбу?"],
        ["Man", "No, I never eat fish.", "Нет, я никогда не ем рыбу."],
        ["Doctor", "Do you go to the gym?", "Вы ходите в спортзал?"],
        ["Man", "Sometimes… Well, not often.", "Иногда… Ну, нечасто."],
      ],
    },
    time: {
      scene: "Коллеги о своём расписании",
      lines: [
        ["Anna", "I get up at 6 o'clock.", "Я встаю в 6 часов."],
        ["Sam", "At six? I get up at nine!", "В шесть? А я в девять!"],
        ["Anna", "I go to the gym on Mondays and Wednesdays.", "По понедельникам и средам я хожу в спортзал."],
        ["Sam", "I go to the gym in January. Only in January!", "А я хожу в спортзал в январе. Только в январе!"],
        ["Anna", "Do you work at the weekend?", "Ты работаешь на выходных?"],
        ["Sam", "No, I don't. At the weekend I sleep.", "Нет. На выходных я сплю."],
      ],
    },
    final: {
      scene: "Том и Анна договариваются о встрече",
      lines: [
        ["Tom", "Do you like jazz?", "Ты любишь джаз?"],
        ["Anna", "No, I don't. I like rock.", "Нет. Я люблю рок."],
        ["Tom", "Do you go out on Saturdays?", "Ты куда-нибудь ходишь по субботам?"],
        ["Anna", "No, I don't. I usually watch a film at home.", "Нет. Обычно я смотрю фильм дома."],
        ["Tom", "I often go for a bike ride.", "А я часто катаюсь на велосипеде."],
        ["Anna", "I work from home on Fridays. Let's go on Friday!", "По пятницам я работаю из дома. Давай в пятницу!"],
      ],
    },
  },

  "present-simple-he-she-it": {
    plus: {
      scene: "Друзья о сестре и брате",
      lines: [
        ["Anna", "My sister works in a hospital.", "Моя сестра работает в больнице."],
        ["Tom", "My brother works in a hospital too!", "Мой брат тоже работает в больнице!"],
        ["Anna", "She starts at seven in the morning.", "Она начинает в семь утра."],
        ["Tom", "He starts at night. He loves his job.", "А он начинает ночью. Он любит свою работу."],
        ["Anna", "She watches films after work.", "После работы она смотрит фильмы."],
        ["Tom", "He sleeps after work!", "А он после работы спит!"],
      ],
    },
    neg: {
      scene: "Мама готовится к приходу девушки сына",
      lines: [
        ["Mum", "Does your girlfriend drink coffee?", "Твоя девушка пьёт кофе?"],
        ["Tom", "No, she doesn't. She drinks tea.", "Нет. Она пьёт чай."],
        ["Mum", "Does she eat meat?", "Она ест мясо?"],
        ["Tom", "No, she doesn't.", "Нет."],
        ["Mum", "Does she like cake?", "А торт она любит?"],
        ["Tom", "Yes, she does!", "Да!"],
        ["Mum", "Great. I've got a cake!", "Отлично. У меня есть торт!"],
      ],
    },
    day: {
      scene: "Подруги о быстрой Хейли",
      lines: [
        ["Kate", "What time does Hayley get up?", "Во сколько встаёт Хейли?"],
        ["Mia", "She gets up at seven.", "В семь."],
        ["Kate", "And she leaves home at 7.30?", "И выходит из дома в 7.30?"],
        ["Mia", "Yes! She has a shower and gets dressed in five minutes.", "Да! Она принимает душ и одевается за пять минут."],
        ["Kate", "Five minutes? I do my hair for twenty minutes!", "За пять минут? Я только волосы укладываю двадцать!"],
        ["Mia", "She doesn't do her hair. She wears a cap!", "Она не укладывает волосы. Она носит кепку!"],
      ],
    },
    jobs: {
      scene: "Угадай профессию",
      lines: [
        ["Tom", "What does your dad do?", "Кем работает твой папа?"],
        ["Lisa", "He takes photos.", "Он фотографирует."],
        ["Tom", "So he's a photographer! And your mum?", "Значит, он фотограф! А мама?"],
        ["Lisa", "She works in a hospital and helps doctors.", "Она работает в больнице и помогает врачам."],
        ["Tom", "She's a nurse!", "Она медсестра!"],
        ["Lisa", "Yes. And your brother?", "Да. А твой брат?"],
        ["Tom", "He plays music in concerts.", "Он играет на концертах."],
        ["Lisa", "A musician!", "Музыкант!"],
      ],
    },
    numbers: {
      scene: "Внук звонит бабушке",
      lines: [
        ["Max", "Grandma, how old is Grandpa?", "Бабушка, сколько лет дедушке?"],
        ["Grandma", "He's eighty.", "Восемьдесят."],
        ["Max", "Eighteen?", "Восемнадцать?"],
        ["Grandma", "No! Eighty! Eight, zero.", "Нет! Восемьдесят! Восемь, ноль."],
        ["Max", "And he gets up at six?", "И он встаёт в шесть?"],
        ["Grandma", "Yes, and he walks for thirty minutes every morning.", "Да, и каждое утро гуляет по тридцать минут."],
      ],
    },
    final: {
      scene: "Соседки обсуждают новую соседку",
      lines: [
        ["Olga", "Our new neighbour doesn't eat meat.", "Наша новая соседка не ест мясо."],
        ["Anna", "Does she live with her family?", "Она живёт с семьёй?"],
        ["Olga", "She lives with her dad. He reads the newspaper on the balcony every morning.", "С папой. Он каждое утро читает газету на балконе."],
        ["Anna", "Every morning?", "Каждое утро?"],
        ["Olga", "Yes, at seven! And she gets home at 6 p.m.", "Да, в семь! А она приходит домой в шесть вечера."],
        ["Anna", "Olga, you know a lot!", "Ольга, ты много знаешь!"],
      ],
    },
  },

  "questions-do-does": {
    yn: {
      scene: "Собеседование на работу",
      lines: [
        ["Boss", "Do you speak English?", "Вы говорите по-английски?"],
        ["Anna", "Yes, I do.", "Да."],
        ["Boss", "Do you get up early?", "Вы рано встаёте?"],
        ["Anna", "Yes, I do. At six.", "Да. В шесть."],
        ["Boss", "Does your family live near here?", "Ваша семья живёт рядом?"],
        ["Anna", "Yes, it does. Why?", "Да. А что?"],
        ["Boss", "We start at seven!", "Мы начинаем в семь!"],
      ],
    },
    wh: {
      scene: "Знакомство в самолёте",
      lines: [
        ["Man", "Where do you live?", "Где вы живёте?"],
        ["Woman", "In Moscow. And you?", "В Москве. А вы?"],
        ["Man", "In Kazan. What do you do?", "В Казани. Кем вы работаете?"],
        ["Woman", "I'm a doctor. Where does your family live?", "Я врач. А где живёт ваша семья?"],
        ["Man", "In Moscow! I go there once a month.", "В Москве! Я езжу туда раз в месяц."],
        ["Woman", "How often do you see them?", "Как часто вы их видите?"],
        ["Man", "Not very often.", "Не очень часто."],
      ],
    },
    "be-do": {
      scene: "Мама звонит папе",
      lines: [
        ["Mum", "Is Kate at home?", "Кейт дома?"],
        ["Dad", "No, she isn't. She's at the gym.", "Нет. Она в спортзале."],
        ["Mum", "Does she go to the gym every day?", "Она ходит в спортзал каждый день?"],
        ["Dad", "Yes, she does.", "Да."],
        ["Mum", "Is she happy?", "Ей нравится?"],
        ["Dad", "Very! And she plays tennis on Sundays.", "Очень! А по воскресеньям она играет в теннис."],
      ],
    },
    free: {
      scene: "Школьники о выходных",
      lines: [
        ["Tom", "How often do you watch football on TV?", "Как часто ты смотришь футбол по телевизору?"],
        ["Max", "Every weekend. And you?", "Каждые выходные. А ты?"],
        ["Tom", "Never. I play games online.", "Никогда. Я играю в игры онлайн."],
        ["Max", "Does your sister play games?", "А твоя сестра играет в игры?"],
        ["Tom", "No, she listens to music and goes to the museum.", "Нет, она слушает музыку и ходит в музей."],
        ["Max", "How often?", "Как часто?"],
        ["Tom", "Once a month. She loves it.", "Раз в месяц. Ей очень нравится."],
      ],
    },
    words: {
      scene: "Галерея. Анна хочет купить картину",
      lines: [
        ["Anna", "How much is this painting?", "Сколько стоит эта картина?"],
        ["Man", "Five hundred pounds.", "Пятьсот фунтов."],
        ["Anna", "Hmm. How many paintings have you got?", "Хм. Сколько у вас картин?"],
        ["Man", "Not many. Only ten.", "Немного. Всего десять."],
        ["Anna", "I haven't got much money…", "У меня не так много денег…"],
        ["Man", "This one is small and cheap!", "Вот эта маленькая и недорогая!"],
      ],
    },
    final: {
      scene: "Новый коллега в первый день",
      lines: [
        ["Anna", "Where are you from?", "Откуда вы?"],
        ["Sam", "I'm from London.", "Из Лондона."],
        ["Anna", "Do you drive to work?", "Вы ездите на работу на машине?"],
        ["Sam", "No, I don't. I take the bus. Does the bus stop near here?", "Нет. Я езжу на автобусе. Он останавливается рядом?"],
        ["Anna", "Yes, it does. Next to the bank.", "Да. Рядом с банком."],
        ["Sam", "Great. What time does the office open?", "Отлично. Во сколько открывается офис?"],
        ["Anna", "At eight.", "В восемь."],
      ],
    },
  },

  "past-simple": {
    was: {
      scene: "Понедельник. Коллеги о субботе",
      lines: [
        ["Anna", "Where were you on Saturday?", "Где ты был в субботу?"],
        ["Tom", "I was at the cinema.", "В кино."],
        ["Anna", "Was the film good?", "Фильм был хороший?"],
        ["Tom", "Yes, it was great! Where were you?", "Да, отличный! А ты где была?"],
        ["Anna", "I was at home. The weather was terrible.", "Дома. Погода была ужасная."],
        ["Tom", "You were right. It was very cold.", "Ты права. Было очень холодно."],
      ],
    },
    ed: {
      scene: "Вечер. Мама звонит Кейт",
      lines: [
        ["Mum", "Hi! I called you at five.", "Привет! Я звонила тебе в пять."],
        ["Kate", "Sorry, Mum. I worked at home all day.", "Прости, мам. Я весь день работала дома."],
        ["Mum", "And in the evening?", "А вечером?"],
        ["Kate", "I cooked dinner and watched a film.", "Приготовила ужин и посмотрела фильм."],
        ["Mum", "Your dad cooked dinner too. He cooked fish. It was terrible!", "Папа тоже готовил ужин. Он приготовил рыбу. Было ужасно!"],
        ["Kate", "Poor Dad!", "Бедный папа!"],
      ],
    },
    irr: {
      scene: "Подруги после отпуска",
      lines: [
        ["Lisa", "We went to Italy last summer!", "Прошлым летом мы ездили в Италию!"],
        ["Mia", "Wow! I went to Spain.", "Ух ты! А я ездила в Испанию."],
        ["Lisa", "We saw a lot of beautiful places.", "Мы видели много красивых мест."],
        ["Mia", "I ate fish every day!", "А я каждый день ела рыбу!"],
        ["Lisa", "I drank coffee every morning.", "Я каждое утро пила кофе."],
        ["Mia", "And I bought a lot of presents.", "А я купила кучу подарков."],
        ["Lisa", "For me?", "Мне?"],
      ],
    },
    neg: {
      scene: "Мама и сын. Домашнее задание",
      lines: [
        ["Mum", "Did you do your homework?", "Ты сделал домашнее задание?"],
        ["Sam", "No, I didn't.", "Нет."],
        ["Mum", "Why? Did you go out?", "Почему? Ты гулял?"],
        ["Sam", "No, I didn't. I watched the match.", "Нет. Я смотрел матч."],
        ["Mum", "Did you like it?", "Понравился?"],
        ["Sam", "No, I didn't. It was boring.", "Нет. Было скучно."],
        ["Mum", "Bad day!", "Плохой день!"],
      ],
    },
    wh: {
      scene: "Друзья после выходных",
      lines: [
        ["Anna", "What did you do at the weekend?", "Что ты делал на выходных?"],
        ["Tom", "I went to the seaside.", "Ездил на море."],
        ["Anna", "Who did you go with?", "С кем ты ездил?"],
        ["Tom", "With my brother. We met our old friend there.", "С братом. Мы встретили там нашего старого друга."],
        ["Anna", "When did you come back?", "Когда вы вернулись?"],
        ["Tom", "On Sunday evening.", "В воскресенье вечером."],
      ],
    },
    final: {
      scene: "Бабушка и внучка",
      lines: [
        ["Grandma", "Where were you last July?", "Где вы были в июле?"],
        ["Lily", "We were at the seaside.", "Мы были на море."],
        ["Grandma", "Did you like it?", "Тебе понравилось?"],
        ["Lily", "Yes, I did! My brother bought a new phone there.", "Да! Мой брат купил там новый телефон."],
        ["Grandma", "And why didn't you come to my party?", "А почему вы не пришли ко мне на праздник?"],
        ["Lily", "Sorry, Grandma! We visited you on Saturday!", "Прости, бабушка! Мы же приходили к тебе в субботу!"],
      ],
    },
  },

  "present-continuous": {
    form: {
      scene: "Папа звонит домой",
      lines: [
        ["Dad", "Hi! What are you doing?", "Привет! Что вы делаете?"],
        ["Kate", "I'm reading a book. Mum is cooking.", "Я читаю книгу. Мама готовит."],
        ["Dad", "And Tom?", "А Том?"],
        ["Kate", "He's listening to music.", "Слушает музыку."],
        ["Dad", "And the cat?", "А кошка?"],
        ["Kate", "The cat is sitting on your laptop!", "Кошка сидит на твоём ноутбуке!"],
      ],
    },
    negq: {
      scene: "Мама проверяет, чем занят Сэм",
      lines: [
        ["Mum", "Are you watching TV?", "Ты смотришь телевизор?"],
        ["Sam", "No, I'm not. I'm doing my homework.", "Нет. Я делаю домашнее задание."],
        ["Mum", "Really? Is your sister working?", "Правда? А сестра работает?"],
        ["Sam", "No, she isn't. She's sleeping.", "Нет. Она спит."],
        ["Mum", "Are you playing games?", "Ты играешь в игры?"],
        ["Sam", "…Yes, I am.", "…Да."],
      ],
    },
    vs: {
      scene: "Том звонит маме на работу",
      lines: [
        ["Tom", "Mum, where are you? You usually finish at five.", "Мам, ты где? Ты обычно заканчиваешь в пять."],
        ["Mum", "Yes, but today I'm working late.", "Да, но сегодня я работаю допоздна."],
        ["Tom", "Where's Dad?", "А где папа?"],
        ["Mum", "He's having a shower.", "Он в душе."],
        ["Tom", "He usually has a shower in the morning!", "Он же обычно принимает душ утром!"],
        ["Mum", "And be quiet! Your sister is sleeping.", "И тише! Твоя сестра спит."],
      ],
    },
    photo: {
      scene: "Подруги смотрят фото",
      lines: [
        ["Anna", "Look at this photo. We're in the park.", "Посмотри на это фото. Мы в парке."],
        ["Kate", "Who is this man? He's wearing a red jacket.", "Кто этот мужчина? Он в красной куртке."],
        ["Anna", "That's my brother.", "Это мой брат."],
        ["Kate", "And the two women on the bench?", "А две женщины на скамейке?"],
        ["Anna", "My mum and my sister. They're talking.", "Мама и сестра. Они разговаривают."],
        ["Kate", "And the dog is lying on the grass. Everybody looks happy!", "А собака лежит на траве. Все выглядят счастливыми!"],
      ],
    },
    final: {
      scene: "Поздний вечер дома",
      lines: [
        ["Mum", "Listen! Somebody is singing.", "Слушай! Кто-то поёт."],
        ["Dad", "It's our neighbour. He's having a shower.", "Это наш сосед. Он в душе."],
        ["Mum", "Are the kids sleeping?", "Дети спят?"],
        ["Dad", "No, they aren't. They're doing their homework.", "Нет. Они делают домашнее задание."],
        ["Mum", "At eleven?", "В одиннадцать?"],
        ["Dad", "Yes. Everybody is working late today!", "Да. Сегодня все работают допоздна!"],
      ],
    },
  },

  "there-is": {
    form: {
      scene: "Анна зовёт Тома в парк",
      lines: [
        ["Anna", "There is a big park near my house.", "Рядом с моим домом большой парк."],
        ["Tom", "Is it nice?", "Красивый?"],
        ["Anna", "Yes! There's a lake and there are a lot of trees.", "Да! Там есть озеро и много деревьев."],
        ["Tom", "Is there a café?", "А кафе есть?"],
        ["Anna", "Yes, there is a café next to the lake.", "Да, рядом с озером есть кафе."],
        ["Tom", "Let's go on Sunday!", "Пойдём в воскресенье!"],
      ],
    },
    negq: {
      scene: "Пустой холодильник",
      lines: [
        ["Tom", "Is there any milk in the fridge?", "В холодильнике есть молоко?"],
        ["Mum", "No, there isn't.", "Нет."],
        ["Tom", "Are there any eggs?", "А яйца?"],
        ["Mum", "No, there aren't.", "Нет."],
        ["Tom", "Is there any bread?", "А хлеб?"],
        ["Mum", "No. There isn't any food. Let's go to the shop!", "Нет. Еды нет совсем. Пойдём в магазин!"],
      ],
    },
    where: {
      scene: "Утро. Том ищет свои вещи",
      lines: [
        ["Tom", "Mum, where is my phone?", "Мам, где мой телефон?"],
        ["Mum", "It's on the table.", "На столе."],
        ["Tom", "And my shoes?", "А моя обувь?"],
        ["Mum", "They're under the bed.", "Под кроватью."],
        ["Tom", "And my bag?", "А сумка?"],
        ["Mum", "It's between the sofa and the door.", "Между диваном и дверью."],
        ["Tom", "And where is my homework?", "А где моё домашнее задание?"],
        ["Mum", "Ask the dog!", "Спроси у собаки!"],
      ],
    },
    home: {
      scene: "Ольга показывает свою квартиру",
      lines: [
        ["Olga", "Welcome! There are three rooms in my flat.", "Добро пожаловать! В моей квартире три комнаты."],
        ["Anna", "Is there a balcony?", "Балкон есть?"],
        ["Olga", "Yes, there is. It's small.", "Да. Маленький."],
        ["Anna", "Where do you sleep?", "Где ты спишь?"],
        ["Olga", "In the bedroom, of course!", "В спальне, конечно!"],
        ["Anna", "Is there a supermarket near here?", "А рядом есть супермаркет?"],
        ["Olga", "Yes, next to my house.", "Да, рядом с моим домом."],
      ],
    },
    final: {
      scene: "Новое кафе на улице",
      lines: [
        ["Kate", "There's a new café in our street!", "На нашей улице открылось новое кафе!"],
        ["Tom", "Are there any free tables?", "Там есть свободные столики?"],
        ["Kate", "Yes, there are two.", "Да, два."],
        ["Tom", "Is there any cake?", "А торт есть?"],
        ["Kate", "Yes, there is. But there isn't any coffee!", "Есть. Но кофе нет!"],
        ["Tom", "A café without coffee?", "Кафе без кофе?"],
      ],
    },
  },

  can: {
    able: {
      scene: "Друзья планируют вечеринку",
      lines: [
        ["Tom", "I can play the guitar.", "Я умею играть на гитаре."],
        ["Anna", "I can sing!", "А я умею петь!"],
        ["Tom", "My brother can drive a car.", "Мой брат умеет водить машину."],
        ["Anna", "My sister can cook very well.", "Моя сестра очень хорошо готовит."],
        ["Tom", "So we can have a party!", "Значит, мы можем устроить вечеринку!"],
        ["Anna", "Yes! Music, food and a car!", "Да! Музыка, еда и машина!"],
      ],
    },
    cant: {
      scene: "Том зовёт кататься на лыжах",
      lines: [
        ["Tom", "Can you ski?", "Ты умеешь кататься на лыжах?"],
        ["Anna", "No, I can't. But I can swim.", "Нет. Зато я умею плавать."],
        ["Tom", "Can your sister ski?", "А твоя сестра умеет?"],
        ["Anna", "Yes, she can. She can ski very well.", "Да. Она отлично катается."],
        ["Tom", "Can she come on Saturday?", "Она может поехать в субботу?"],
        ["Anna", "No, she can't. She's at work.", "Нет. Она на работе."],
      ],
    },
    ask: {
      scene: "Жаркий день в кафе",
      lines: [
        ["Anna", "Can I sit here?", "Можно я здесь сяду?"],
        ["Man", "Yes, of course.", "Да, конечно."],
        ["Anna", "It's hot in here. Can you open the window, please?", "Здесь жарко. Можете открыть окно, пожалуйста?"],
        ["Man", "Sure.", "Конечно."],
        ["Waiter", "Hello!", "Здравствуйте!"],
        ["Anna", "Hello! Can I have a cold coffee, please?", "Здравствуйте! Можно мне холодный кофе, пожалуйста?"],
      ],
    },
    final: {
      scene: "Учительница готовит школьный концерт",
      lines: [
        ["Teacher", "Who can play the piano?", "Кто умеет играть на пианино?"],
        ["Lily", "I can!", "Я!"],
        ["Teacher", "Great! Can you sing too?", "Отлично! А петь умеешь?"],
        ["Lily", "No, I can't. But Max can.", "Нет. Но Макс умеет."],
        ["Max", "Yes, I can sing, but I can't dance!", "Да, петь умею, а танцевать — нет!"],
        ["Teacher", "No problem. Max can sing and Lily can play!", "Не страшно. Макс поёт, а Лили играет!"],
      ],
    },
  },

  "pronouns-articles": {
    obj: {
      scene: "Подруги о Томе",
      lines: [
        ["Anna", "Do you know Tom?", "Ты знаешь Тома?"],
        ["Kate", "Yes, I know him well. Why?", "Да, хорошо его знаю. А что?"],
        ["Anna", "I like him!", "Он мне нравится!"],
        ["Kate", "Call him!", "Позвони ему!"],
        ["Anna", "No, you call him. Tell him about me!", "Нет, ты позвони. Расскажи ему обо мне!"],
        ["Kate", "OK, OK. And come and visit us on Friday!", "Ладно, ладно. И приходи к нам в пятницу!"],
      ],
    },
    art: {
      scene: "Дети рассказывают о питомцах",
      lines: [
        ["Tom", "I have a dog.", "У меня есть собака."],
        ["Lily", "I have a cat and a fish.", "А у меня кошка и рыбка."],
        ["Tom", "The dog is very big and very friendly.", "Собака очень большая и очень добрая."],
        ["Lily", "The cat isn't friendly. It sleeps all day.", "Кошка недружелюбная. Она весь день спит."],
        ["Tom", "And the fish?", "А рыбка?"],
        ["Lily", "The fish is my best friend!", "Рыбка — мой лучший друг!"],
      ],
    },
    plural: {
      scene: "Мама смотрит школьное фото",
      lines: [
        ["Mum", "How many children are there in the photo?", "Сколько детей на фото?"],
        ["Sam", "Twenty-five.", "Двадцать пять."],
        ["Mum", "And how many teachers?", "А учителей?"],
        ["Sam", "Two. The women on the left.", "Двое. Женщины слева."],
        ["Mum", "The people in your class look very friendly.", "Ребята в твоём классе выглядят очень дружелюбными."],
        ["Sam", "They are!", "Так и есть!"],
      ],
    },
    like: {
      scene: "Вечер. Выбираем фильм",
      lines: [
        ["Anna", "Do you like horror films?", "Ты любишь фильмы ужасов?"],
        ["Max", "No, I hate them.", "Нет, ненавижу."],
        ["Anna", "What do you like?", "А что любишь?"],
        ["Max", "I love comedies. And you?", "Обожаю комедии. А ты?"],
        ["Anna", "I don't like films. I like reading in the evening.", "Я не люблю фильмы. По вечерам я люблю читать."],
        ["Max", "OK, no film. Let's read!", "Ладно, без фильма. Давай читать!"],
      ],
    },
    final: {
      scene: "Том ищет знакомых",
      lines: [
        ["Anna", "I saw Kate and Max yesterday.", "Вчера я видела Кейт и Макса."],
        ["Tom", "I know them! Kate is a nurse.", "Я их знаю! Кейт — медсестра."],
        ["Anna", "And Max is an engineer.", "А Макс — инженер."],
        ["Tom", "Can you give me their number?", "Можешь дать мне их номер?"],
        ["Anna", "Sure. Call me at six.", "Конечно. Позвони мне в шесть."],
      ],
    },
  },

  "food-cafe": {
    count: {
      scene: "Мама и Кейт готовят салат",
      lines: [
        ["Mum", "How many tomatoes do we need?", "Сколько нам нужно помидоров?"],
        ["Kate", "Three.", "Три."],
        ["Mum", "And how much cheese?", "А сколько сыра?"],
        ["Kate", "Not much.", "Немного."],
        ["Mum", "And eggs?", "А яйца?"],
        ["Kate", "Two eggs, please. And some bread.", "Два яйца, пожалуйста. И немного хлеба."],
      ],
    },
    some: {
      scene: "Составляем список покупок",
      lines: [
        ["Tom", "Do we need any milk?", "Нам нужно молоко?"],
        ["Anna", "Yes, we need some milk. There isn't any in the fridge.", "Да, нужно. В холодильнике его нет."],
        ["Tom", "And juice?", "А сок?"],
        ["Anna", "We've got a lot of juice.", "Сока у нас много."],
        ["Tom", "Do we need any eggs?", "Яйца нужны?"],
        ["Anna", "Yes, some eggs and some cheese.", "Да, яйца и сыр."],
      ],
    },
    cafe: {
      scene: "Анна заказывает в кафе",
      lines: [
        ["Waiter", "Hello! What would you like?", "Здравствуйте! Что будете заказывать?"],
        ["Anna", "I'd like a tea and a piece of cake, please.", "Мне чай и кусок торта, пожалуйста."],
        ["Waiter", "Anything else?", "Что-нибудь ещё?"],
        ["Anna", "A glass of water, please.", "Стакан воды, пожалуйста."],
        ["Waiter", "Here you are.", "Пожалуйста."],
        ["Anna", "Thank you. Can I have the bill, please?", "Спасибо. Можно счёт, пожалуйста?"],
      ],
    },
    money: {
      scene: "Магазин одежды",
      lines: [
        ["Anna", "How much is this jacket?", "Сколько стоит эта куртка?"],
        ["Seller", "It's forty pounds.", "Сорок фунтов."],
        ["Anna", "And these shoes?", "А эти туфли?"],
        ["Seller", "They're sixty pounds.", "Шестьдесят фунтов."],
        ["Anna", "Sixty? That's a lot of money!", "Шестьдесят? Это много денег!"],
        ["Seller", "But they're very beautiful!", "Зато они очень красивые!"],
      ],
    },
    final: {
      scene: "Завтрак. Том голодный",
      lines: [
        ["Tom", "Is there any bread?", "Хлеб есть?"],
        ["Mum", "No, there isn't any bread at home.", "Нет, дома хлеба нет."],
        ["Tom", "Can I have an apple, please?", "Можно мне яблоко?"],
        ["Mum", "Here you are. How much water do you drink every day?", "Держи. Сколько воды ты пьёшь каждый день?"],
        ["Tom", "Not much. A few glasses.", "Немного. Пару стаканов."],
        ["Mum", "Drink more!", "Пей больше!"],
      ],
    },
  },
};
