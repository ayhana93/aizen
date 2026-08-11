import { site, type Locale } from "./site";

/**
 * All copy lives here so the BG/EN toggle stays a single switch.
 * Written from the buyer's side of the screen: an extrusion plant's
 * purchasing or quality lead deciding whether to send an inquiry.
 */
export const content = {
  bg: {
    langLabel: "EN",
    nav: [
      { id: "process", label: "Процес" },
      { id: "alloys", label: "Сплави" },
      { id: "product", label: "Билети" },
      { id: "lab", label: "Лаборатория" },
      { id: "contact", label: "Контакт" },
    ],
    cta: "Запитване",
    hero: {
      eyebrow: "Леярна за алуминиеви билети · Пловдив",
      title: ["Скрапът влиза", "студен.", "Излиза билет", "със сертификат."],
      lead:
        "AIZEN METAL претопява алуминиев скрап и лее хомогенизирани билети за екструзия в сплави 6060 и 6063. Всяка партида напуска завода с анализ от собствената ни лаборатория.",
      scroll: "Скролвай, за да загрее",
      stats: [
        { value: "720", unit: "°C", label: "температура на леене" },
        { value: "6060 / 6063", unit: "", label: "сплави по EN 573-3" },
        { value: "Ø152–228", unit: "мм", label: "диаметри на билети" },
      ],
    },
    process: {
      eyebrow: "Процес",
      title: "От скрап до билет",
      lead:
        "Шест етапа. Температурата на страницата следва температурата на метала — скролвайте през пещта и обратно до студения, готов билет.",
      steps: [
        {
          n: "01",
          title: "Изкупуване на скрап",
          temp: "20 °C",
          body:
            "Приемаме алуминиев скрап — профили, стружка, отпадък от екструзия и лист. Всяка доставка се претегля, класифицира и разделя по вид, преди да влезе в шихтата.",
        },
        {
          n: "02",
          title: "Шихта и топене",
          temp: "720 °C",
          body:
            "Скрапът се зарежда в пещта и се разтапя. Шихтата се изчислява спрямо целевата сплав, така че химията да попадне в диапазона още преди корекция с лигатури.",
        },
        {
          n: "03",
          title: "Рафиниране и дегазация",
          temp: "730 °C",
          body:
            "Стопилката се обработва с инертен газ и флюс за отстраняване на водород и включения. Шлаката се сваля, а пробата за спектрален анализ се взима преди изливане.",
        },
        {
          n: "04",
          title: "Непрекъснато леене",
          temp: "700 °C",
          body:
            "Метал­ът се лее вертикално през филтър и дегазатор в кристализатори с водно охлаждане. Скоростта и охлаждането определят структурата на сърцевината.",
        },
        {
          n: "05",
          title: "Хомогенизация",
          temp: "575 °C",
          body:
            "Билетите се хомогенизират и охлаждат контролирано. Това изравнява структурата и прави метала предвидим при екструзия — по-нисък натиск, по-чиста повърхност.",
        },
        {
          n: "06",
          title: "Рязане, контрол, експедиция",
          temp: "20 °C",
          body:
            "Рязане по зададена дължина, ултразвуков и визуален контрол, маркиране на партидата и сертификат. Пакетирано и готово за товарене.",
        },
      ],
    },
    alloys: {
      eyebrow: "Сплави",
      title: "6060 и 6063",
      lead:
        "И двете са Al-Mg-Si сплави за екструзия. Разликата е в магнезия и силиция — 6063 носи повече Mg и дава по-висока якост, 6060 тече по-леко и прощава повече при сложни профили.",
      hint: "Изберете сплав, за да сравните химичния състав",
      tableHead: ["Елемент", "6060", "6063"],
      note:
        "Границите са по EN 573-3 (тегловни %, остатъкът е Al). Точният състав на всяка партида се посочва в сертификата за партидата.",
      cards: [
        {
          id: "6060",
          name: "EN AW-6060",
          tagline: "Мек, пластичен, за сложни сечения",
          uses: [
            "Архитектурни профили и дограма",
            "Тънкостенни и сложни сечения",
            "Анодиране и прахово боядисване",
          ],
          temper: "T5 · T6 · T66",
        },
        {
          id: "6063",
          name: "EN AW-6063",
          tagline: "По-висока якост, отлична повърхност",
          uses: [
            "Конструктивни профили с натоварване",
            "Тръби, парапети, слънцезащита",
            "Декоративно анодиране",
          ],
          temper: "T5 · T6 · T66",
        },
      ],
    },
    product: {
      eyebrow: "Продукт",
      title: "Билети за екструзия",
      lead:
        "Хомогенизирани, с фрезована или лята повърхност, нарязани по вашата преса. Конфигурирайте по-долу — размерът се отразява веднага върху билета вдясно.",
      diameterLabel: "Диаметър",
      lengthLabel: "Дължина",
      alloyLabel: "Сплав",
      weightLabel: "Тегло на билет",
      weightNote: "Изчислено при плътност 2,70 г/см³ — ориентировъчно.",
      askFor: "Поискайте оферта за тази конфигурация",
      specs: [
        { k: "Състояние", v: "Хомогенизиран, контролирано охладен" },
        { k: "Повърхност", v: "Лята или фрезована по заявка" },
        { k: "Толеранс дължина", v: "± 5 мм (по договаряне)" },
        { k: "Опаковка", v: "Пакети с ленти, дървени подложки" },
      ],
    },
    lab: {
      eyebrow: "Лаборатория",
      title: "Всяка партида идва с числа",
      lead:
        "Собствената ни лаборатория взима проба от всяка стопилка преди изливане и издава сертификат за партидата. Не пускаме метал, чиято химия не е записана.",
      readout: "Спектрален анализ · проба преди изливане",
      points: [
        {
          title: "Проба от стопилката",
          body: "Взема се преди изливане, докато корекцията на химията още е възможна.",
        },
        {
          title: "Оптично-емисионен анализ",
          body: "Всеки легиращ елемент се отчита и сравнява с диапазона на сплавта.",
        },
        {
          title: "Сертификат за партида",
          body: "Химичен състав, номер на партида, сплав, размер и дата — с всяка доставка.",
        },
      ],
      certTitle: "Сертификат за партида",
      certFields: [
        ["Партида", "AZ-2026-0000"],
        ["Сплав", "EN AW-6063"],
        ["Размер", "Ø178 × 6000 мм"],
        ["Състояние", "Хомогенизиран"],
      ],
      certFoot: "Примерен изглед. Реалният документ носи подпис на лабораторията.",
    },
    circular: {
      eyebrow: "Кръговрат",
      title: "Металът не се изхабява",
      lead:
        "Алуминият се рециклира без загуба на свойства, а претопяването му изисква около 5% от енергията за производство на първичен алуминий. Профилът, който сваляте от една сграда днес, може да е билет следващия месец.",
      loop: ["Скрап", "Стопилка", "Билет", "Профил", "Скрап"],
      buying: {
        title: "Изкупуваме алуминиев скрап",
        body:
          "Профили, стружка, отпадък от екструзия, лист и производствен брак. Кажете ни вид и количество и ще се върнем с цена.",
        cta: "Предложете скрап",
      },
    },
    location: {
      eyebrow: "Локация",
      title: "Радиново, Пловдив",
      lead:
        "Заводът е в Северната индустриална зона на Пловдив — на минути от АМ „Тракия“ и на час и половина от Пристанище Бургас. Товаренето е на място, по график.",
      cta: "Отвори в карта",
    },
    contact: {
      eyebrow: "Запитване",
      title: "Кажете какво ви трябва",
      lead:
        "Сплав, диаметър, дължина и количество са достатъчни, за да върнем цена и срок. Отговаряме в рамките на работния ден.",
      form: {
        name: "Име",
        company: "Фирма",
        email: "Имейл",
        phone: "Телефон",
        subject: "Запитването е за",
        subjects: [
          { v: "billets", l: "Покупка на билети" },
          { v: "scrap", l: "Продажба на скрап към вас" },
          { v: "other", l: "Друго" },
        ],
        alloy: "Сплав",
        diameter: "Диаметър",
        length: "Дължина",
        quantity: "Количество (тона)",
        message: "Съобщение",
        messagePlaceholder: "Толеранси, срок, честота на доставките…",
        submit: "Изпрати запитване",
        sending: "Изпращане…",
        successTitle: "Запитването е изпратено",
        successBody: "Получихме го. Ще се свържем с вас в рамките на работния ден.",
        errorTitle: "Запитването не тръгна",
        errorBody: "Опитайте отново или ни пишете директно на",
        required: "задължително",
        invalidEmail: "Проверете имейл адреса",
        tooShort: "Добавете още малко информация",
        again: "Ново запитване",
      },
    },
    footer: {
      tagline: "Леярна за алуминиеви билети · сплави 6060 и 6063",
      rights: "Всички права запазени.",
      nav: "Навигация",
      contacts: "Контакти",
    },
  },

  en: {
    langLabel: "BG",
    nav: [
      { id: "process", label: "Process" },
      { id: "alloys", label: "Alloys" },
      { id: "product", label: "Billets" },
      { id: "lab", label: "Laboratory" },
      { id: "contact", label: "Contact" },
    ],
    cta: "Get a quote",
    hero: {
      eyebrow: "Aluminium billet foundry · Plovdiv, Bulgaria",
      title: ["Scrap goes in", "cold.", "A certified billet", "comes out."],
      lead:
        "AIZEN METAL remelts aluminium scrap and casts homogenised extrusion billets in 6060 and 6063. Every batch leaves the plant with an analysis from our own laboratory.",
      scroll: "Scroll to heat it up",
      stats: [
        { value: "720", unit: "°C", label: "casting temperature" },
        { value: "6060 / 6063", unit: "", label: "alloys to EN 573-3" },
        { value: "Ø152–228", unit: "mm", label: "billet diameters" },
      ],
    },
    process: {
      eyebrow: "Process",
      title: "From scrap to billet",
      lead:
        "Six stages. The page runs at the temperature of the metal — scroll through the furnace and back down to a cold, finished billet.",
      steps: [
        {
          n: "01",
          title: "Scrap intake",
          temp: "20 °C",
          body:
            "We buy aluminium scrap: profiles, turnings, extrusion offcuts and sheet. Every delivery is weighed, classified and sorted by type before it reaches the charge.",
        },
        {
          n: "02",
          title: "Charge and melt",
          temp: "720 °C",
          body:
            "The scrap is charged into the furnace and melted. The charge is calculated against the target alloy so the chemistry lands in range before any master-alloy correction.",
        },
        {
          n: "03",
          title: "Refining and degassing",
          temp: "730 °C",
          body:
            "The melt is treated with inert gas and flux to remove hydrogen and inclusions. Dross is skimmed and a spectrometer sample is drawn before casting.",
        },
        {
          n: "04",
          title: "Continuous casting",
          temp: "700 °C",
          body:
            "Metal is cast vertically through a filter and degasser into water-cooled moulds. Casting speed and cooling set the structure of the billet core.",
        },
        {
          n: "05",
          title: "Homogenisation",
          temp: "575 °C",
          body:
            "Billets are homogenised and cooled under control. This evens out the structure and makes the metal predictable on the press — lower pressure, cleaner surface.",
        },
        {
          n: "06",
          title: "Cutting, inspection, dispatch",
          temp: "20 °C",
          body:
            "Cut to your length, ultrasonically and visually inspected, batch-marked and certified. Bundled and ready to load.",
        },
      ],
    },
    alloys: {
      eyebrow: "Alloys",
      title: "6060 and 6063",
      lead:
        "Both are Al-Mg-Si extrusion alloys. The difference is magnesium and silicon — 6063 carries more Mg and reaches higher strength, 6060 flows more easily and is more forgiving on complex sections.",
      hint: "Pick an alloy to compare the chemistry",
      tableHead: ["Element", "6060", "6063"],
      note:
        "Limits per EN 573-3 (weight %, balance Al). The exact composition of each batch is stated on its batch certificate.",
      cards: [
        {
          id: "6060",
          name: "EN AW-6060",
          tagline: "Soft, ductile, for intricate sections",
          uses: [
            "Architectural profiles and window systems",
            "Thin-walled and complex sections",
            "Anodising and powder coating",
          ],
          temper: "T5 · T6 · T66",
        },
        {
          id: "6063",
          name: "EN AW-6063",
          tagline: "Higher strength, excellent surface",
          uses: [
            "Load-bearing structural profiles",
            "Tubes, railings, solar shading",
            "Decorative anodising",
          ],
          temper: "T5 · T6 · T66",
        },
      ],
    },
    product: {
      eyebrow: "Product",
      title: "Extrusion billets",
      lead:
        "Homogenised, scalped or as-cast, cut for your press. Configure below — the size updates the billet on the right immediately.",
      diameterLabel: "Diameter",
      lengthLabel: "Length",
      alloyLabel: "Alloy",
      weightLabel: "Weight per billet",
      weightNote: "Calculated at 2.70 g/cm³ — indicative.",
      askFor: "Request a quote for this configuration",
      specs: [
        { k: "Condition", v: "Homogenised, controlled cooling" },
        { k: "Surface", v: "As-cast or scalped on request" },
        { k: "Length tolerance", v: "± 5 mm (negotiable)" },
        { k: "Packing", v: "Strapped bundles on timber bearers" },
      ],
    },
    lab: {
      eyebrow: "Laboratory",
      title: "Every batch arrives with numbers",
      lead:
        "Our own laboratory samples every melt before casting and issues a batch certificate. We do not release metal whose chemistry is not on record.",
      readout: "Spectrometer analysis · sample drawn before casting",
      points: [
        {
          title: "Sample from the melt",
          body: "Drawn before casting, while correcting the chemistry is still possible.",
        },
        {
          title: "Optical emission analysis",
          body: "Every alloying element is read and checked against the alloy's range.",
        },
        {
          title: "Batch certificate",
          body: "Composition, batch number, alloy, size and date — with every delivery.",
        },
      ],
      certTitle: "Batch certificate",
      certFields: [
        ["Batch", "AZ-2026-0000"],
        ["Alloy", "EN AW-6063"],
        ["Size", "Ø178 × 6000 mm"],
        ["Condition", "Homogenised"],
      ],
      certFoot: "Sample view. The real document carries the laboratory's signature.",
    },
    circular: {
      eyebrow: "Circularity",
      title: "The metal does not wear out",
      lead:
        "Aluminium recycles without losing its properties, and remelting it takes roughly 5% of the energy needed for primary metal. The profile stripped off a building today can be a billet next month.",
      loop: ["Scrap", "Melt", "Billet", "Profile", "Scrap"],
      buying: {
        title: "We buy aluminium scrap",
        body:
          "Profiles, turnings, extrusion offcuts, sheet and production rejects. Tell us the type and tonnage and we will come back with a price.",
        cta: "Offer us scrap",
      },
    },
    location: {
      eyebrow: "Location",
      title: "Radinovo, Plovdiv",
      lead:
        "The plant sits in Plovdiv's North Industrial Zone — minutes from the Trakia motorway and an hour and a half from the Port of Burgas. Loading is on site, by schedule.",
      cta: "Open in maps",
    },
    contact: {
      eyebrow: "Inquiry",
      title: "Tell us what you need",
      lead:
        "Alloy, diameter, length and tonnage are enough for us to come back with a price and a lead time. We reply within the working day.",
      form: {
        name: "Name",
        company: "Company",
        email: "Email",
        phone: "Phone",
        subject: "This inquiry is about",
        subjects: [
          { v: "billets", l: "Buying billets" },
          { v: "scrap", l: "Selling scrap to you" },
          { v: "other", l: "Something else" },
        ],
        alloy: "Alloy",
        diameter: "Diameter",
        length: "Length",
        quantity: "Quantity (tonnes)",
        message: "Message",
        messagePlaceholder: "Tolerances, lead time, delivery frequency…",
        submit: "Send inquiry",
        sending: "Sending…",
        successTitle: "Inquiry sent",
        successBody: "We have it. We will come back to you within the working day.",
        errorTitle: "The inquiry did not go through",
        errorBody: "Try again, or write to us directly at",
        required: "required",
        invalidEmail: "Check the email address",
        tooShort: "Add a little more detail",
        again: "New inquiry",
      },
    },
    footer: {
      tagline: "Aluminium billet foundry · alloys 6060 and 6063",
      rights: "All rights reserved.",
      nav: "Navigation",
      contacts: "Contacts",
    },
  },
} satisfies Record<Locale, unknown>;

export type Dict = (typeof content)["bg"];

/**
 * EN 573-3 composition limits, weight %. `null` upper bound means "balance".
 * Reference data — the batch certificate is always the authority.
 */
export const alloyChemistry = [
  { el: "Si", "6060": [0.3, 0.6], "6063": [0.2, 0.6] },
  { el: "Fe", "6060": [0.1, 0.3], "6063": [0, 0.35] },
  { el: "Cu", "6060": [0, 0.1], "6063": [0, 0.1] },
  { el: "Mn", "6060": [0, 0.1], "6063": [0, 0.1] },
  { el: "Mg", "6060": [0.35, 0.6], "6063": [0.45, 0.9] },
  { el: "Cr", "6060": [0, 0.05], "6063": [0, 0.1] },
  { el: "Zn", "6060": [0, 0.15], "6063": [0, 0.1] },
  { el: "Ti", "6060": [0, 0.1], "6063": [0, 0.1] },
] as const;

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${site.geo.lat},${site.geo.lng}`;
