// «Переведите с русского»: four sentences at the end of each topic that the student writes in full.
// Choosing an option only asks to recognise the right form; writing the whole sentence asks to build it.
// Each lesson file calls addTranslation(lesson) after its own groups, so the group is always appended last
// and existing item ids (section-group-item) and students' progress stay the same. New groups go below that call.
// Answers are compared after norm() in src/engine.js: case, punctuation and I'm / don't / haven't / I've … are
// already equal to the full forms. List separately: there's, can't, I'd, a noun + 's (= has), numbers vs words.
import { inp, group } from "./_helpers.mjs";

// No prompt under each sentence: the group title already says what to do.
const t = (ru, a, ex) => inp(`«${ru}»`, a, ex);

const TRANSLATE = {
  "to-be": {
    plus: [
      t("Моя мама — учитель.", ["My mum is a teacher.", "My mother is a teacher.", "My mom is a teacher."], "My mum + is + a teacher. Перед профессией — a."),
      t("Мы в Москве.", ["We are in Moscow."], "We + are + in Moscow."),
      t("Они из Италии.", ["They are from Italy."], "They + are + from Italy."),
      t("Я дома.", ["I am at home.", "I am home."], "I + am + at home."),
    ],
    neg: [
      t("Я не врач.", ["I am not a doctor."], "I am not / I'm not + a doctor."),
      t("Его нет дома.", ["He is not at home.", "He is not home."], "He isn't / He's not + at home."),
      t("Мы не заняты.", ["We are not busy."], "We aren't / We're not + busy."),
      t("Магазин не открыт.", ["The shop is not open.", "The store is not open."], "The shop + isn't + open."),
    ],
    yn: [
      t("Ты голоден?", ["Are you hungry?"], "Вопрос: are ставим в начало — Are you hungry?"),
      t("Она замужем?", ["Is she married?"], "Is + she + married?"),
      t("Твой брат врач?", ["Is your brother a doctor?"], "Is + your brother + a doctor?"),
      t("Это место свободно?", ["Is this seat free?", "Is this place free?"], "Is + this seat + free?"),
    ],
    wh: [
      t("Где мой телефон?", ["Where is my phone?"], "Where + is + my phone?"),
      t("Сколько тебе лет?", ["How old are you?"], "Возраст — How old are you?"),
      t("Кто твой учитель?", ["Who is your teacher?"], "Who + is + your teacher?"),
      t("Когда урок?", ["When is the lesson?", "When is the class?"], "When + is + the lesson?"),
    ],
    order: [
      t("Я работаю из дома.", ["I work from home."], "Кто + что делает + где: I work from home."),
      t("Сегодня холодно.", ["It is cold today.", "Today it is cold."], "Погода — через it: It's cold today."),
      t("Мой начальник в офисе.", ["My boss is in the office.", "My boss is at the office.", "My boss is at work."], "My boss + is + in the office."),
      t("Мы плаваем каждое утро.", ["We swim every morning."], "We swim + every morning."),
    ],
    nat: [
      t("Лука — итальянец.", ["Luca is Italian."], "Национальность — без a и с большой буквы: Italian."),
      t("Она из Японии.", ["She is from Japan."], "from + страна: from Japan."),
      t("Суши — японское блюдо.", ["Sushi is a Japanese dish."], "a Japanese dish — японское блюдо."),
      t("Мы из Москвы.", ["We are from Moscow."], "We + are + from Moscow."),
    ],
    words: [
      t("У нас десятиминутный перерыв.", ["We have a 10-minute break.", "We have a ten-minute break.", "We have a 10 minute break.", "We have a ten minute break."], "a 10-minute break: minute без -s."),
      t("Это трёхмесячный курс.", ["It is a three-month course.", "This is a three-month course.", "It is a three month course.", "This is a three month course."], "a three-month course: month без -s."),
      t("Часы над дверью.", ["The clock is above the door.", "The clock is over the door."], "above — над."),
      t("Она шестилетняя девочка.", ["She is a six-year-old girl.", "She is a six year old girl."], "a six-year-old girl: year без -s."),
    ],
    similar: [
      t("Идёт дождь.", ["It is raining."], "It's raining — it's = it is."),
      t("Я интересуюсь музыкой.", ["I am interested in music."], "Я интересуюсь — I'm interested in."),
      t("Эта книга интересная.", ["This book is interesting."], "Интересная вещь — interesting."),
      t("У птицы синие крылья.", ["The bird's wings are blue.", "Its wings are blue.", "The bird has blue wings.", "The bird has got blue wings."], "its — её (у животного или вещи), без апострофа."),
    ],
    rus: [
      t("Моя сестра врач.", ["My sister is a doctor."], "По-русски без глагола, по-английски нужен is."),
      t("Где твой телефон?", ["Where is your phone?"], "Where + is + your phone?"),
      t("Ты занят?", ["Are you busy?"], "Are + you + busy?"),
      t("Нас нет дома.", ["We are not at home.", "We are not home."], "Нас нет дома — We aren't at home."),
    ],
    past: [
      t("Смотри! Идёт снег.", ["Look! It is snowing."], "Прямо сейчас — is + -ing."),
      t("Я готовлю ужин.", ["I am cooking dinner.", "I am making dinner."], "I'm + cooking."),
      t("Вчера мы были дома.", ["We were at home yesterday.", "Yesterday we were at home.", "We were home yesterday.", "Yesterday we were home."], "Вчера: we were."),
      t("Погода была ужасная.", ["The weather was terrible.", "The weather was awful."], "Прошлое: was."),
    ],
    intro: [
      t("Это мой друг Ник.", ["This is my friend Nick."], "Представляем: This is…"),
      t("Меня зовут Анна.", ["My name is Anna.", "I am Anna."], "My name's Anna / I'm Anna."),
      t("Я увлекаюсь фотографией.", ["I am interested in photography.", "I am into photography."], "I'm interested in + photography."),
      t("В какой ты группе?", ["What class are you in?", "Which class are you in?", "What group are you in?", "Which group are you in?"], "Предлог в конце: What class are you in?"),
    ],
    words2: [
      t("Банк слева.", ["The bank is on the left."], "on the left — слева."),
      t("Картина над диваном.", ["The picture is above the sofa.", "The picture is over the sofa.", "The painting is above the sofa."], "above — над."),
      t("Я хожу в спортзал три раза в неделю.", ["I go to the gym three times a week."], "three times a week — три раза в неделю."),
      t("Кафе рядом с банком.", ["The café is next to the bank.", "The cafe is next to the bank.", "The café is near the bank.", "The cafe is near the bank."], "next to — рядом с."),
    ],
    final: [
      t("Мои бабушка и дедушка из Армении.", ["My grandparents are from Armenia."], "grandparents — они, значит are."),
      t("Урок не трудный.", ["The lesson is not difficult.", "The lesson is not hard."], "isn't + difficult."),
      t("Где ближайшая аптека?", ["Where is the nearest pharmacy?", "Where is the nearest chemist's?"], "the nearest — ближайшая."),
      t("Твой папа пилот?", ["Is your dad a pilot?", "Is your father a pilot?"], "Is + your dad + a pilot?"),
    ],
  },

  whose: {
    things: [
      t("Мои ключи на столе.", ["My keys are on the table."], "keys — несколько, значит are."),
      t("Эти перчатки очень тёплые.", ["These gloves are very warm."], "gloves — всегда во множественном: these, are."),
      t("Где мой кошелёк?", ["Where is my wallet?", "Where is my purse?"], "Where + is + my wallet?"),
      t("Мои очки в машине.", ["My glasses are in the car.", "My sunglasses are in the car."], "glasses — всегда во множественном: are."),
    ],
    this: [
      t("Это мои ключи.", ["These are my keys."], "Близко и несколько — these are."),
      t("Посмотри на того мужчину!", ["Look at that man!", "Look at that man over there!"], "Далеко и один — that."),
      t("Те сумки очень большие.", ["Those bags are very big."], "Далеко и несколько — those."),
      t("Этот шарф новый.", ["This scarf is new."], "Близко и один — this."),
    ],
    my: [
      t("Это твоя куртка?", ["Is this your jacket?", "Is that your jacket?"], "your + предмет."),
      t("Том не может найти свои ключи.", ["Tom can't find his keys.", "Tom cannot find his keys."], "Свои у него — his."),
      t("Мы любим нашу квартиру.", ["We love our flat.", "We love our apartment.", "We like our flat.", "We like our apartment."], "Наша — our."),
      t("Она любит свою работу.", ["She loves her job.", "She likes her job.", "She loves her work."], "Своя у неё — her."),
    ],
    mine: [
      t("Этот свитер твой?", ["Is this sweater yours?", "Is this jumper yours?", "Is this your sweater?"], "Без предмета после — yours."),
      t("Эти перчатки её.", ["These gloves are hers."], "Без предмета — hers."),
      t("Это не моё.", ["It is not mine.", "This is not mine.", "That is not mine."], "Без предмета — mine."),
      t("Блокнот мой!", ["The notebook is mine!", "The notebook is mine.", "It is my notebook!"], "Без предмета — mine."),
    ],
    whose: [
      t("Чьи это ключи?", ["Whose keys are these?", "Whose keys are those?", "Whose are these keys?", "Whose are these?"], "Whose + предмет + are these?"),
      t("Чья это машина?", ["Whose car is this?", "Whose car is that?", "Whose is this car?"], "Whose + car + is this?"),
      t("Это телефон Анны.", ["This is Anna's phone.", "It is Anna's phone.", "That is Anna's phone."], "Чей-то — через 's: Anna's phone."),
      t("Это сумка моей сестры.", ["This is my sister's bag.", "It is my sister's bag.", "That is my sister's bag."], "my sister's bag — сумка сестры."),
    ],
    words: [
      t("Холодно. Давай останемся дома.", ["It is cold. Let's stay inside.", "It is cold. Let's stay at home.", "It is cold. Let's stay home.", "It is cold. Let us stay inside."], "Let's stay inside — давай останемся внутри."),
      t("Дети на улице.", ["The children are outside.", "The kids are outside."], "На улице — outside."),
      t("Какая сумка твоя?", ["Which bag is yours?"], "Из нескольких — which."),
      t("Красная — моя.", ["The red one is mine."], "one вместо повтора слова: the red one."),
    ],
    final: [
      t("Это мои новые очки.", ["These are my new glasses.", "These are my new sunglasses."], "glasses — these are."),
      t("Та сумка твоя?", ["Is that bag yours?", "Is that your bag?"], "Далеко — that; без предмета — yours."),
      t("Чьи это перчатки?", ["Whose gloves are these?", "Whose gloves are those?", "Whose are these gloves?"], "Whose + gloves + are these?"),
      t("Это ключи Тома.", ["These are Tom's keys.", "They are Tom's keys.", "Those are Tom's keys."], "Tom's keys — ключи Тома."),
    ],
  },

  "have-got": {
    plus: [
      t("У меня новый ноутбук.", ["I have got a new laptop.", "I have a new laptop."], "I've got = I have got."),
      t("У моей сестры голубые глаза.", ["My sister has got blue eyes.", "My sister has blue eyes.", "My sister's got blue eyes."], "Она — has got."),
      t("У нас две кошки.", ["We have got two cats.", "We have two cats."], "We've got two cats."),
      t("У него большая машина.", ["He has got a big car.", "He's got a big car.", "He has a big car."], "He's got = he has got."),
    ],
    neg: [
      t("У меня нет ручки.", ["I have not got a pen.", "I do not have a pen.", "I have no pen."], "I haven't got a pen."),
      t("У моего брата нет машины.", ["My brother has not got a car.", "My brother does not have a car.", "My brother has no car."], "Он — hasn't got."),
      t("У нас нет яиц.", ["We have not got any eggs.", "We do not have any eggs.", "We have no eggs."], "В отрицании — any: haven't got any eggs."),
      t("У неё нет домашних животных.", ["She has not got any pets.", "She does not have any pets.", "She has no pets."], "hasn't got any pets."),
    ],
    q: [
      t("У тебя есть минутка?", ["Have you got a minute?", "Do you have a minute?"], "Have you got…?"),
      t("В твоей квартире есть балкон?", ["Has your flat got a balcony?", "Does your flat have a balcony?", "Has your apartment got a balcony?", "Does your apartment have a balcony?"], "Квартира — она: Has your flat got…?"),
      t("У них есть машина?", ["Have they got a car?", "Do they have a car?"], "Have they got…?"),
      t("У тебя есть сёстры?", ["Have you got any sisters?", "Do you have any sisters?", "Have you got sisters?", "Do you have sisters?"], "В вопросе — any: Have you got any sisters?"),
    ],
    have: [
      t("У тебя есть ручка?", ["Do you have a pen?", "Have you got a pen?"], "Do you have = Have you got."),
      t("У неё нет машины.", ["She does not have a car.", "She has not got a car.", "She has no car."], "She doesn't have = She hasn't got."),
      t("У меня есть собака.", ["I have a dog.", "I have got a dog."], "I have = I've got."),
      t("У нас большая квартира.", ["We have a big flat.", "We have got a big flat.", "We have a big apartment.", "We have got a big apartment."], "We have / We've got."),
    ],
    adj: [
      t("Мой ноутбук сломан.", ["My laptop is broken."], "broken — сломанный."),
      t("Этот телефон маленький и лёгкий.", ["This phone is small and light.", "This phone is light and small.", "This mobile is small and light."], "light — лёгкий по весу."),
      t("Мой мишка очень мягкий.", ["My teddy bear is very soft.", "My teddy is very soft."], "soft — мягкий."),
      t("Этот блокнот очень полезный.", ["This notebook is very useful."], "useful — полезный."),
    ],
    words: [
      t("Ник — писатель.", ["Nick is a writer."], "write — писать, a writer — писатель."),
      t("Я везде беру с собой телефон.", ["I take my phone everywhere.", "I take my phone with me everywhere."], "everywhere — везде."),
      t("Сегодня все счастливы.", ["Everybody is happy today.", "Everyone is happy today.", "Today everybody is happy.", "Today everyone is happy."], "everybody — он, значит is."),
      t("Моя сумка такая же, как твоя.", ["My bag is the same as yours."], "the same as — такой же, как."),
    ],
    final: [
      t("У моего брата новый мотоцикл.", ["My brother has got a new motorbike.", "My brother has a new motorbike.", "My brother's got a new motorbike.", "My brother has got a new motorcycle.", "My brother has a new motorcycle."], "Он — has got."),
      t("У неё длинные волосы.", ["She has got long hair.", "She's got long hair.", "She has long hair."], "hair — без -s и без a."),
      t("У них нет собаки.", ["They have not got a dog.", "They do not have a dog.", "They have no dog."], "They haven't got a dog."),
      t("У твоей сестры есть машина?", ["Has your sister got a car?", "Does your sister have a car?"], "Has your sister got…?"),
    ],
  },

  "present-simple-i-you-we-they": {
    plus: [
      t("Я живу в Москве.", ["I live in Moscow."], "Обычно: I live."),
      t("Мы работаем в банке.", ["We work in a bank.", "We work at a bank."], "We work — без окончания."),
      t("Они играют в теннис по воскресеньям.", ["They play tennis on Sundays.", "On Sundays they play tennis."], "on Sundays — по воскресеньям."),
      t("Я люблю кофе.", ["I love coffee.", "I like coffee."], "I love / I like."),
    ],
    neg: [
      t("Я не пью кофе.", ["I do not drink coffee."], "don't + глагол."),
      t("Ты играешь на гитаре?", ["Do you play the guitar?", "Do you play guitar?"], "Do + you + play?"),
      t("Они работают по субботам?", ["Do they work on Saturdays?"], "Do + they + work?"),
      t("Мы не живём здесь.", ["We do not live here."], "We don't live here."),
    ],
    free: [
      t("По субботам мы встречаемся с друзьями.", ["We meet friends on Saturdays.", "We meet our friends on Saturdays.", "On Saturdays we meet friends.", "On Saturdays we meet our friends.", "We meet with friends on Saturdays."], "meet friends — встречаться с друзьями."),
      t("Я читаю по вечерам.", ["I read in the evening.", "I read in the evenings."], "in the evening — вечером."),
      t("Они смотрят спорт по телевизору.", ["They watch sport on TV.", "They watch sports on TV."], "on TV — по телевизору."),
      t("Я сижу в интернете каждый вечер.", ["I go online every evening.", "I am online every evening."], "go online — выходить в интернет."),
    ],
    often: [
      t("Я всегда пью кофе утром.", ["I always drink coffee in the morning.", "I always have coffee in the morning."], "always — перед глаголом."),
      t("Я никогда не ем рыбу.", ["I never eat fish."], "never — уже «не»: I never eat."),
      t("Мы часто ходим в кино.", ["We often go to the cinema.", "We often go to the movies."], "often — перед глаголом."),
      t("Иногда я готовлю ужин.", ["I sometimes cook dinner.", "Sometimes I cook dinner.", "I sometimes make dinner.", "Sometimes I make dinner."], "sometimes — перед глаголом или в начале."),
    ],
    time: [
      t("Я встаю в семь часов.", ["I get up at seven o'clock.", "I get up at 7 o'clock.", "I get up at seven.", "I get up at 7."], "Время — at."),
      t("Мой день рождения в июне.", ["My birthday is in June."], "Месяц — in."),
      t("Я не работаю по выходным.", ["I do not work at the weekend.", "I do not work at weekends.", "I do not work on weekends.", "I do not work on the weekend."], "at the weekend — на выходных."),
      t("Мы ходим в спортзал по вторникам.", ["We go to the gym on Tuesdays.", "On Tuesdays we go to the gym."], "День недели — on."),
    ],
    final: [
      t("По пятницам я работаю из дома.", ["I work from home on Fridays.", "On Fridays I work from home."], "on Fridays — по пятницам."),
      t("Ты любишь джаз?", ["Do you like jazz?", "Do you love jazz?"], "Do + you + like?"),
      t("По субботам мы никуда не ходим.", ["We do not go out on Saturdays.", "On Saturdays we do not go out."], "go out — выходить куда-нибудь."),
      t("Я часто катаюсь на велосипеде.", ["I often go for a bike ride.", "I often ride a bike.", "I often ride my bike.", "I often go cycling."], "often + глагол."),
    ],
  },

  "present-simple-he-she-it": {
    plus: [
      t("Моя сестра работает в больнице.", ["My sister works in a hospital.", "My sister works at a hospital."], "Она — works, с -s."),
      t("Он любит свою работу.", ["He loves his job.", "He likes his job.", "He loves his work."], "He loves — с -s."),
      t("Фильм начинается в восемь.", ["The film starts at eight.", "The film starts at 8.", "The movie starts at eight.", "The movie starts at 8.", "The film begins at eight.", "The film begins at 8."], "It — starts, с -s."),
      t("Она смотрит телевизор каждый вечер.", ["She watches TV every evening."], "watch → watches (после ch — -es)."),
    ],
    neg: [
      t("Мой брат не пьёт кофе.", ["My brother does not drink coffee."], "doesn't + глагол без -s."),
      t("Твоя сестра живёт в Лондоне?", ["Does your sister live in London?"], "Does + she + live (без -s)?"),
      t("Она не ест мясо.", ["She does not eat meat."], "She doesn't eat."),
      t("Он работает по ночам?", ["Does he work at night?", "Does he work at nights?", "Does he work nights?"], "Does + he + work?"),
    ],
    day: [
      t("Она встаёт в семь.", ["She gets up at seven.", "She gets up at 7."], "get up → gets up."),
      t("Он принимает душ каждое утро.", ["He has a shower every morning.", "He takes a shower every morning."], "have → has a shower."),
      t("Она выходит из дома в восемь.", ["She leaves home at eight.", "She leaves home at 8.", "She leaves the house at eight.", "She leaves the house at 8."], "leave → leaves."),
      t("Он ложится спать в одиннадцать.", ["He goes to bed at eleven.", "He goes to bed at 11."], "go → goes to bed."),
    ],
    jobs: [
      t("Мой папа — фотограф.", ["My dad is a photographer.", "My father is a photographer."], "Профессия — с a."),
      t("Она медсестра.", ["She is a nurse."], "a nurse."),
      t("Чем занимается твой брат?", ["What does your brother do?", "What is your brother's job?"], "What does he do? — кем работает."),
      t("Он музыкант.", ["He is a musician."], "a musician."),
    ],
    numbers: [
      t("Моей бабушке восемьдесят лет.", ["My grandmother is eighty.", "My grandmother is 80.", "My grandmother is eighty years old.", "My grandmother is 80 years old.", "My grandma is eighty.", "My grandma is 80."], "Возраст — через is: she's eighty."),
      t("У неё тринадцать внуков.", ["She has thirteen grandchildren.", "She has 13 grandchildren.", "She has got thirteen grandchildren.", "She has got 13 grandchildren.", "She's got thirteen grandchildren.", "She's got 13 grandchildren."], "thirteen — 13, thirty — 30."),
      t("Он читает тридцать минут.", ["He reads for thirty minutes.", "He reads for 30 minutes."], "thirty — 30."),
      t("Мне пятнадцать.", ["I am fifteen.", "I am 15.", "I am fifteen years old.", "I am 15 years old."], "I'm fifteen."),
    ],
    final: [
      t("Мой папа читает газету каждое утро.", ["My dad reads the newspaper every morning.", "My father reads the newspaper every morning.", "My dad reads the paper every morning.", "My father reads the paper every morning.", "My dad reads a newspaper every morning."], "He reads — с -s."),
      t("Она приходит домой в шесть.", ["She gets home at six.", "She gets home at 6.", "She comes home at six.", "She comes home at 6."], "get home → gets home."),
      t("Твоя сестра живёт с тобой?", ["Does your sister live with you?"], "Does + your sister + live?"),
      t("Он не водит машину.", ["He does not drive.", "He does not drive a car."], "He doesn't drive."),
    ],
  },

  "questions-do-does": {
    yn: [
      t("Ты рано встаёшь?", ["Do you get up early?"], "Do + you + get up?"),
      t("Твоя сестра пьёт кофе?", ["Does your sister drink coffee?"], "Does + your sister + drink?"),
      t("Твои родители живут рядом с тобой?", ["Do your parents live near you?", "Do your parents live close to you?"], "parents — они: Do."),
      t("Он знает Дженни?", ["Does he know Jenny?"], "Does + he + know?"),
    ],
    wh: [
      t("Где ты живёшь?", ["Where do you live?"], "Where + do + you + live?"),
      t("Где работает твой брат?", ["Where does your brother work?"], "Where + does + your brother + work?"),
      t("Во сколько ты встаёшь?", ["What time do you get up?", "When do you get up?"], "What time + do + you…?"),
      t("Как часто ты слушаешь музыку?", ["How often do you listen to music?"], "How often + do + you…?"),
    ],
    "be-do": [
      t("Она певица?", ["Is she a singer?"], "Кто она — is."),
      t("Она играет в теннис?", ["Does she play tennis?"], "Что делает обычно — does."),
      t("Они в автобусе?", ["Are they on the bus?", "Are they in the bus?"], "Где они — are."),
      t("Ты любишь чай?", ["Do you like tea?"], "Что любишь — do."),
    ],
    free: [
      t("Я всегда слушаю музыку в машине.", ["I always listen to music in the car."], "listen to music — слушать музыку."),
      t("Как часто ты смотришь футбол?", ["How often do you watch football?", "How often do you watch football on TV?"], "How often do you…?"),
      t("Она играет в игры онлайн.", ["She plays games online.", "She plays online games."], "She plays — с -s."),
      t("Я хожу в музей раз в месяц.", ["I go to a museum once a month.", "I go to the museum once a month.", "I visit a museum once a month."], "once a month — раз в месяц."),
    ],
    words: [
      t("Сколько у тебя братьев?", ["How many brothers have you got?", "How many brothers do you have?"], "Считаем — how many."),
      t("Сколько стоит эта картина?", ["How much is this painting?", "How much does this painting cost?", "How much is this picture?"], "Цена — how much."),
      t("Я не пью много чая.", ["I do not drink much tea.", "I do not drink a lot of tea."], "Чай не считаем — much."),
      t("У неё здесь немного друзей.", ["She has not got many friends here.", "She does not have many friends here."], "Друзей считаем — many."),
    ],
    final: [
      t("Он ездит на работу на машине?", ["Does he drive to work?"], "Does + he + drive?"),
      t("Откуда твои родители?", ["Where are your parents from?"], "Предлог в конце: Where are they from?"),
      t("Во сколько уходит поезд?", ["What time does the train leave?", "When does the train leave?"], "The train — it: does."),
      t("У тебя достаточно времени?", ["Do you have enough time?", "Have you got enough time?"], "enough time — достаточно времени."),
    ],
  },

  "past-simple": {
    was: [
      t("Вчера я был в кино.", ["I was at the cinema yesterday.", "Yesterday I was at the cinema.", "I was in the cinema yesterday.", "I was at the movies yesterday."], "I — was."),
      t("Вечеринка была отличная.", ["The party was great.", "The party was very good."], "It — was."),
      t("Где ты был в субботу?", ["Where were you on Saturday?"], "You — were."),
      t("Они были дома.", ["They were at home.", "They were home."], "They — were."),
    ],
    ed: [
      t("Вчера я работал дома.", ["I worked at home yesterday.", "I worked from home yesterday.", "Yesterday I worked at home.", "Yesterday I worked from home."], "work → worked."),
      t("Вечером мы посмотрели фильм.", ["We watched a film in the evening.", "In the evening we watched a film.", "We watched a movie in the evening.", "In the evening we watched a movie."], "watch → watched."),
      t("Она позвонила мне в пять.", ["She called me at five.", "She called me at 5.", "She phoned me at five.", "She phoned me at 5."], "call → called."),
      t("Я приготовил ужин.", ["I cooked dinner.", "I made dinner."], "cook → cooked."),
    ],
    irr: [
      t("Прошлым летом мы ездили в Италию.", ["We went to Italy last summer.", "Last summer we went to Italy."], "go → went."),
      t("Утром я пил кофе.", ["I drank coffee in the morning.", "I had coffee in the morning.", "In the morning I drank coffee.", "In the morning I had coffee."], "drink → drank."),
      t("Мы видели хороший фильм.", ["We saw a good film.", "We saw a good movie."], "see → saw."),
      t("Она купила подарок.", ["She bought a present.", "She bought a gift."], "buy → bought."),
    ],
    neg: [
      t("Вчера я не ходил на работу.", ["I did not go to work yesterday.", "Yesterday I did not go to work."], "didn't + go (начальная форма)."),
      t("Ты смотрел матч?", ["Did you watch the match?", "Did you watch the game?"], "Did + you + watch?"),
      t("Им понравилась гостиница?", ["Did they like the hotel?"], "Did + they + like?"),
      t("Она не взяла ключи.", ["She did not take her keys.", "She did not take the keys."], "didn't + take."),
    ],
    wh: [
      t("Куда ты ездил?", ["Where did you go?"], "Where + did + you + go?"),
      t("Что ты делал на выходных?", ["What did you do at the weekend?", "What did you do on the weekend?", "What did you do at the weekends?"], "What + did + you + do?"),
      t("Когда она тебе позвонила?", ["When did she call you?", "When did she phone you?"], "When + did + she + call?"),
      t("Кого вы встретили?", ["Who did you meet?"], "Who + did + you + meet?"),
    ],
    final: [
      t("Прошлым июлем мы были на море.", ["We were at the seaside last July.", "Last July we were at the seaside.", "We were at the sea last July.", "Last July we were at the sea."], "We — were."),
      t("Он купил новую машину.", ["He bought a new car."], "buy → bought."),
      t("Они не пришли на вечеринку.", ["They did not come to the party."], "didn't + come."),
      t("В субботу я навестил бабушку.", ["I visited my grandmother on Saturday.", "I visited my grandma on Saturday.", "On Saturday I visited my grandmother.", "On Saturday I visited my grandma."], "visit → visited."),
    ],
  },

  "present-continuous": {
    form: [
      t("Я читаю книгу.", ["I am reading a book."], "Сейчас: am + reading."),
      t("Она слушает музыку.", ["She is listening to music."], "is + listening."),
      t("Мы ужинаем.", ["We are having dinner.", "We are eating dinner."], "are + having dinner."),
      t("Кошка сидит на столе.", ["The cat is sitting on the table."], "sit → sitting (две t)."),
    ],
    negq: [
      t("Ты смотришь телевизор?", ["Are you watching TV?"], "Are + you + watching?"),
      t("Я никого не жду.", ["I am not waiting for anybody.", "I am not waiting for anyone."], "am not + waiting."),
      t("Они обедают?", ["Are they having lunch?", "Are they eating lunch?"], "Are + they + having lunch?"),
      t("Она сегодня работает?", ["Is she working today?"], "Is + she + working?"),
    ],
    vs: [
      t("Обычно я заканчиваю в семь.", ["I usually finish at seven.", "I usually finish at 7.", "Usually I finish at seven.", "Usually I finish at 7."], "Обычно — Present Simple."),
      t("Сегодня я работаю допоздна.", ["Today I am working late.", "I am working late today."], "Сегодня, сейчас — am working."),
      t("Тише! Ребёнок спит.", ["Be quiet! The baby is sleeping."], "Прямо сейчас — is sleeping."),
      t("Моя сестра работает в больнице.", ["My sister works in a hospital.", "My sister works at a hospital."], "Постоянно — works."),
    ],
    photo: [
      t("Мужчина в красной куртке.", ["The man is wearing a red jacket.", "A man is wearing a red jacket."], "На фото одет — is wearing."),
      t("Две женщины сидят на скамейке.", ["Two women are sitting on a bench.", "Two women are sitting on the bench."], "women — они: are sitting."),
      t("Собака лежит на траве.", ["The dog is lying on the grass.", "A dog is lying on the grass."], "lie → lying."),
      t("Они выглядят счастливыми.", ["They look happy.", "They look very happy."], "look happy — выглядеть счастливым."),
    ],
    final: [
      t("Кто-то поёт.", ["Somebody is singing.", "Someone is singing."], "is + singing."),
      t("Я делаю домашнее задание.", ["I am doing my homework.", "I am doing homework."], "do homework → am doing."),
      t("Они не обедают.", ["They are not having lunch.", "They are not eating lunch."], "aren't + having."),
      t("Он сегодня работает?", ["Is he working today?"], "Is + he + working?"),
    ],
  },

  "there-is": {
    form: [
      t("Рядом с моим домом есть парк.", ["There is a park near my house.", "There's a park near my house.", "There is a park next to my house.", "There's a park next to my house."], "Один — There is."),
      t("В нашей квартире три комнаты.", ["There are three rooms in our flat.", "There are three rooms in our apartment."], "Несколько — There are."),
      t("В магазине много людей.", ["There are a lot of people in the shop.", "There are many people in the shop.", "There are lots of people in the shop.", "There are a lot of people in the store."], "people — несколько: There are."),
      t("В бутылке есть вода.", ["There is some water in the bottle.", "There is water in the bottle.", "There's some water in the bottle.", "There's water in the bottle."], "Воду не считаем — There is some water."),
    ],
    negq: [
      t("В холодильнике есть молоко?", ["Is there any milk in the fridge?", "Is there milk in the fridge?"], "Вопрос: Is there any…?"),
      t("В парке нет детей.", ["There are not any children in the park.", "There are no children in the park."], "There aren't any…"),
      t("Здесь есть лифт?", ["Is there a lift here?", "Is there an elevator here?", "Is there a lift?"], "Is there a…?"),
      t("Хлеба нет.", ["There is not any bread.", "There is no bread."], "There isn't any bread."),
    ],
    where: [
      t("Телефон на столе.", ["The phone is on the table."], "on — на поверхности."),
      t("Туфли под кроватью.", ["The shoes are under the bed."], "under — под."),
      t("Кафе рядом с банком.", ["The café is next to the bank.", "The cafe is next to the bank."], "next to — рядом с."),
      t("Сумка между диваном и дверью.", ["The bag is between the sofa and the door."], "between — между."),
    ],
    home: [
      t("В моей квартире есть балкон.", ["There is a balcony in my flat.", "There's a balcony in my flat.", "There is a balcony in my apartment.", "There's a balcony in my apartment.", "My flat has a balcony.", "My flat has got a balcony."], "There is a balcony…"),
      t("Здесь рядом есть супермаркет?", ["Is there a supermarket near here?", "Is there a supermarket nearby?"], "Is there a…?"),
      t("Я сплю в спальне.", ["I sleep in the bedroom.", "I sleep in my bedroom."], "bedroom — спальня."),
      t("На кухне есть стол.", ["There is a table in the kitchen.", "There's a table in the kitchen."], "There is + что + где."),
    ],
    final: [
      t("На нашей улице новое кафе.", ["There is a new café in our street.", "There's a new café in our street.", "There is a new cafe in our street.", "There's a new cafe in our street.", "There is a new café on our street.", "There is a new cafe on our street.", "There's a new café on our street.", "There's a new cafe on our street."], "There is a new café…"),
      t("В комнате пять человек.", ["There are five people in the room."], "There are + five people."),
      t("В холодильнике нет молока.", ["There is not any milk in the fridge.", "There is no milk in the fridge."], "There isn't any milk."),
      t("В зале нет стульев.", ["There are not any chairs in the hall.", "There are no chairs in the hall."], "There aren't any chairs."),
    ],
  },

  can: {
    able: [
      t("Я умею играть на гитаре.", ["I can play the guitar.", "I can play guitar."], "can + глагол."),
      t("Она очень хорошо готовит.", ["She can cook very well.", "She cooks very well."], "can cook — умеет готовить."),
      t("Мой брат умеет водить машину.", ["My brother can drive a car.", "My brother can drive."], "can + drive."),
      t("Мы умеем плавать.", ["We can swim."], "can + swim."),
    ],
    cant: [
      t("Я не умею кататься на лыжах.", ["I can't ski.", "I cannot ski."], "can't = cannot."),
      t("Ты можешь мне помочь?", ["Can you help me?"], "Can + you + help?"),
      t("Она умеет плавать?", ["Can she swim?"], "Can + she + swim?"),
      t("Они не могут прийти сегодня вечером.", ["They can't come tonight.", "They cannot come tonight.", "They can't come this evening.", "They cannot come this evening."], "can't + come."),
    ],
    ask: [
      t("Можно мне кофе, пожалуйста?", ["Can I have a coffee, please?", "Can I have coffee, please?", "Can I have a coffee?", "Can I have coffee?", "Could I have a coffee, please?"], "Can I have…? — можно мне."),
      t("Можешь открыть окно, пожалуйста?", ["Can you open the window, please?", "Can you open the window?", "Could you open the window, please?", "Please can you open the window?"], "Can you…? — просьба."),
      t("Можно я здесь сяду?", ["Can I sit here?", "Could I sit here?"], "Can I…? — разрешение."),
      t("Можете говорить медленнее?", ["Can you speak more slowly?", "Can you speak slowly?", "Can you speak slower?", "Could you speak more slowly?"], "Can you speak more slowly?"),
    ],
    final: [
      t("Моя сестра очень хорошо поёт.", ["My sister can sing very well.", "My sister sings very well."], "can sing."),
      t("Я умею плавать, но не умею кататься на лыжах.", ["I can swim, but I can't ski.", "I can swim, but I cannot ski."], "can / can't."),
      t("Он не умеет водить машину.", ["He can't drive.", "He cannot drive.", "He can't drive a car.", "He cannot drive a car."], "can't + drive."),
      t("Ты умеешь играть на пианино?", ["Can you play the piano?", "Can you play piano?"], "Can + you + play?"),
    ],
  },

  "pronouns-articles": {
    obj: [
      t("Я хорошо его знаю.", ["I know him well."], "После глагола — him."),
      t("Позвони мне.", ["Call me.", "Phone me.", "Call me, please."], "После глагола — me."),
      t("Приходи к нам в гости!", ["Come and visit us!", "Come and see us!", "Visit us!"], "После глагола — us."),
      t("Я часто ей звоню.", ["I often call her.", "I often phone her."], "После глагола — her."),
    ],
    art: [
      t("Мой отец — инженер.", ["My father is an engineer.", "My dad is an engineer."], "Перед гласным звуком — an."),
      t("У меня есть собака. Собака очень дружелюбная.", ["I have a dog. The dog is very friendly.", "I have got a dog. The dog is very friendly."], "Впервые — a, уже известная — the."),
      t("Закрой дверь, пожалуйста.", ["Close the door, please.", "Please close the door.", "Close the door."], "Понятно какая — the door."),
      t("Я не люблю фильмы ужасов.", ["I do not like horror films.", "I do not like horror movies."], "Вообще, в целом — без артикля."),
    ],
    plural: [
      t("На фото трое детей.", ["There are three children in the photo.", "There are three children in the picture."], "child → children."),
      t("Люди здесь очень дружелюбные.", ["People are very friendly here.", "The people are very friendly here.", "People here are very friendly.", "The people here are very friendly."], "people — они: are."),
      t("Сколько городов в твоей стране?", ["How many cities are there in your country?", "How many cities are in your country?"], "city → cities."),
      t("У меня две коробки.", ["I have two boxes.", "I have got two boxes."], "box → boxes."),
    ],
    like: [
      t("Я люблю читать.", ["I like reading.", "I love reading.", "I like to read.", "I love to read."], "like + -ing."),
      t("Она не любит рано вставать.", ["She does not like getting up early.", "She does not like to get up early."], "doesn't like + getting up."),
      t("Это моя любимая песня. Я её обожаю.", ["This is my favourite song. I love it.", "This is my favorite song. I love it."], "Песня — it."),
      t("Тебе нравится этот фильм?", ["Do you like this film?", "Do you like this movie?"], "Do you like…?"),
    ],
    final: [
      t("Я хорошо их знаю.", ["I know them well."], "После глагола — them."),
      t("Позвони мне в шесть.", ["Call me at six.", "Call me at 6.", "Phone me at six.", "Phone me at 6."], "me + at six."),
      t("Моя мама медсестра.", ["My mother is a nurse.", "My mum is a nurse.", "My mom is a nurse."], "Профессия — a nurse."),
      t("Дай их мне, пожалуйста.", ["Give them to me, please.", "Please give them to me.", "Give them to me."], "give them to me."),
    ],
  },

  "food-cafe": {
    count: [
      t("Сколько сахара ты кладёшь?", ["How much sugar do you take?", "How much sugar do you put?", "How much sugar do you have?"], "Сахар не считаем — how much."),
      t("Сколько нам нужно помидоров?", ["How many tomatoes do we need?"], "Помидоры считаем — how many."),
      t("На завтрак я съел два яйца.", ["I had two eggs for breakfast.", "I ate two eggs for breakfast."], "have … for breakfast."),
      t("Я бы хотел кофе и два сэндвича.", ["I'd like a coffee and two sandwiches.", "I would like a coffee and two sandwiches."], "I'd like — я бы хотел."),
    ],
    some: [
      t("Нам нужны яйца?", ["Do we need any eggs?", "Do we need eggs?"], "В вопросе — any."),
      t("Я купил сыр и помидоры.", ["I bought some cheese and tomatoes.", "I bought cheese and tomatoes.", "I bought some cheese and some tomatoes."], "some — немного, какие-то."),
      t("В бутылке нет сока.", ["There is not any juice in the bottle.", "There is no juice in the bottle."], "There isn't any juice."),
      t("Можно мне воды, пожалуйста?", ["Can I have some water, please?", "Can I have water, please?", "Can I have some water?", "Can I have water?"], "Просьба — some."),
    ],
    cafe: [
      t("Мне чай, пожалуйста.", ["I'd like a tea, please.", "I would like a tea, please.", "Can I have a tea, please?", "A tea, please.", "Tea, please."], "I'd like… / Can I have…?"),
      t("Можно счёт, пожалуйста?", ["Can I have the bill, please?", "Can I have the bill?", "The bill, please.", "Could I have the bill, please?"], "the bill — счёт."),
      t("Стакан воды, пожалуйста.", ["A glass of water, please.", "Can I have a glass of water, please?", "I'd like a glass of water, please.", "I would like a glass of water, please."], "a glass of water."),
      t("Сколько это стоит?", ["How much is it?", "How much is that?", "How much does it cost?", "How much is this?"], "How much is it?"),
    ],
    money: [
      t("Сколько стоит эта куртка?", ["How much is this jacket?", "How much does this jacket cost?"], "Одна вещь — is."),
      t("Сколько стоят эти туфли?", ["How much are these shoes?", "How much do these shoes cost?"], "Несколько — are."),
      t("Это стоит сорок фунтов.", ["It is forty pounds.", "It is 40 pounds.", "It costs forty pounds.", "It costs 40 pounds."], "forty — 40."),
      t("Это много денег.", ["That is a lot of money.", "It is a lot of money.", "This is a lot of money."], "money — без -s: a lot of money."),
    ],
    final: [
      t("Дома нет хлеба.", ["There is not any bread at home.", "There is no bread at home."], "There isn't any bread."),
      t("Можно мне яблоко?", ["Can I have an apple?", "Can I have an apple, please?"], "an apple — перед гласной an."),
      t("Сколько воды ты пьёшь?", ["How much water do you drink?"], "Воду не считаем — how much."),
      t("У меня здесь несколько друзей.", ["I have a few friends here.", "I have got a few friends here.", "I have some friends here."], "a few — несколько."),
    ],
  },
};

// Append the group to every topic of this lesson that has sentences here.
export function addTranslation(lesson) {
  const bySection = TRANSLATE[lesson.slug];
  if (!bySection) return lesson;
  for (const [id, items] of Object.entries(bySection)) {
    const s = lesson.sections.find(x => x.id === id);
    if (!s) throw new Error(`translate.mjs: ${lesson.slug} has no section ${id}`);
    s.groups.push(group("Переведите с русского", items));
  }
  return lesson;
}

export const translationSlugs = Object.keys(TRANSLATE);
