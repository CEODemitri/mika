'use client'

import { useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────
type Deity = {
  name: string
  title: string
  domain: string
  symbol: string
  planet?: string
  description: string
  details: { label: string; value: string }[]
  color: string // hsl string for card accent
}

type Pantheon = {
  id: string
  label: string
  region: string
  glyph: string
  description: string
  deities: Deity[]
}

// ── Pantheon Data ─────────────────────────────────────────────────────────────
const PANTHEONS: Pantheon[] = [
  {
    id: 'greek',
    label: 'Greek',
    region: 'Hellas',
    glyph: 'Ω',
    description: 'The Olympians who shaped fate, war, love, and the cosmos from their throne on Mount Olympus.',
    deities: [
      {
        name: 'Zeus',
        title: 'King of the Gods',
        domain: 'Sky & Thunder',
        symbol: '⚡',
        planet: 'Jupiter',
        color: '42, 72%, 52%',
        description: 'Supreme ruler of Olympus, wielder of the thunderbolt, and arbiter of divine law. Zeus governs the sky, orchestrates fate, and upholds the cosmic order — though his will is often complicated by desire.',
        details: [
          { label: 'Sacred Animal', value: 'Eagle' },
          { label: 'Sacred Tree', value: 'Oak' },
          { label: 'Consort', value: 'Hera' },
          { label: 'Roman Name', value: 'Jupiter' },
          { label: 'Weapon', value: 'Thunderbolt' },
          { label: 'Realm', value: 'Mount Olympus' },
        ],
      },
      {
        name: 'Athena',
        title: 'Goddess of Wisdom',
        domain: 'Wisdom & War Strategy',
        symbol: '🦉',
        planet: 'Mercury',
        color: '210, 70%, 52%',
        description: 'Born fully armored from the head of Zeus, Athena embodies strategic intellect, craft, and just warfare. Patron of Athens, she favors heroes who think before they strike.',
        details: [
          { label: 'Sacred Animal', value: 'Owl' },
          { label: 'Sacred Tree', value: 'Olive' },
          { label: 'Attribute', value: 'Aegis & Spear' },
          { label: 'Roman Name', value: 'Minerva' },
          { label: 'Domain', value: 'Wisdom, Crafts' },
          { label: 'Born From', value: 'Head of Zeus' },
        ],
      },
      {
        name: 'Apollo',
        title: 'God of the Sun',
        domain: 'Sun, Music & Prophecy',
        symbol: '☀',
        planet: 'Sun',
        color: '38, 85%, 55%',
        description: 'The radiant god of light, truth, and the arts. Apollo drives the sun across the sky and speaks through the Oracle at Delphi. His arrows bring both healing and plague.',
        details: [
          { label: 'Sacred Animal', value: 'Dolphin & Crow' },
          { label: 'Sacred Tree', value: 'Laurel' },
          { label: 'Attribute', value: 'Lyre & Bow' },
          { label: 'Roman Name', value: 'Apollo' },
          { label: 'Oracle', value: 'Delphi' },
          { label: 'Twin', value: 'Artemis' },
        ],
      },
      {
        name: 'Artemis',
        title: 'Goddess of the Hunt',
        domain: 'Moon, Hunt & Wilderness',
        symbol: '🌙',
        planet: 'Moon',
        color: '220, 50%, 65%',
        description: 'Eternal huntress and guardian of the wild. Artemis roams forests by moonlight, protecting women and wildlife alike. She demands chastity and devotion — and punishes those who violate her sacred groves.',
        details: [
          { label: 'Sacred Animal', value: 'Deer & Bear' },
          { label: 'Sacred Tree', value: 'Cypress' },
          { label: 'Attribute', value: 'Silver Bow' },
          { label: 'Roman Name', value: 'Diana' },
          { label: 'Twin', value: 'Apollo' },
          { label: 'Domain', value: 'Wilderness, Moon' },
        ],
      },
      {
        name: 'Poseidon',
        title: 'God of the Sea',
        domain: 'Sea, Earthquakes & Horses',
        symbol: '🔱',
        planet: 'Neptune',
        color: '200, 75%, 45%',
        description: 'Lord of the deep waters and shaker of the earth, Poseidon rules all oceans and commands the storms. His wrath sinks fleets; his favor grants safe passage.',
        details: [
          { label: 'Sacred Animal', value: 'Horse & Dolphin' },
          { label: 'Attribute', value: 'Trident' },
          { label: 'Roman Name', value: 'Neptune' },
          { label: 'Realm', value: 'The Sea' },
          { label: 'Brothers', value: 'Zeus, Hades' },
          { label: 'Domain', value: 'Oceans, Earthquakes' },
        ],
      },
      {
        name: 'Hades',
        title: 'King of the Underworld',
        domain: 'Death & the Underworld',
        symbol: '⚰',
        planet: 'Pluto',
        color: '260, 30%, 40%',
        description: 'Silent sovereign of the realm of the dead. Hades is not a god of evil but of inevitability — all mortals pass through his kingdom. He rules with cold justice and rarely leaves his domain.',
        details: [
          { label: 'Sacred Animal', value: 'Black Ram' },
          { label: 'Attribute', value: 'Cap of Invisibility' },
          { label: 'Roman Name', value: 'Pluto' },
          { label: 'Consort', value: 'Persephone' },
          { label: 'Realm', value: 'The Underworld' },
          { label: 'River', value: 'Styx' },
        ],
      },
      {
        name: 'Hermes',
        title: 'Messenger of the Gods',
        domain: 'Travel, Commerce & Thieves',
        symbol: '⚕',
        planet: 'Mercury',
        color: '160, 55%, 48%',
        description: 'Swift-footed herald of Olympus, guide of souls to the underworld, patron of travelers and merchants. Hermes is cunning, witty, and the only god who moves freely between all realms.',
        details: [
          { label: 'Sacred Animal', value: 'Tortoise & Ram' },
          { label: 'Attribute', value: 'Caduceus & Winged Sandals' },
          { label: 'Roman Name', value: 'Mercury' },
          { label: 'Domain', value: 'Messengers, Thieves' },
          { label: 'Role', value: 'Psychopomp' },
          { label: 'Inventor of', value: 'The Lyre' },
        ],
      },
      {
        name: 'Aphrodite',
        title: 'Goddess of Love',
        domain: 'Love, Beauty & Desire',
        symbol: '♀',
        planet: 'Venus',
        color: '345, 65%, 55%',
        description: 'Born from sea foam near Cyprus, Aphrodite embodies desire in all its forms. Her power moves gods and mortals alike — she sparked the Trojan War with a single golden apple.',
        details: [
          { label: 'Sacred Animal', value: 'Dove & Swan' },
          { label: 'Sacred Flower', value: 'Rose & Myrtle' },
          { label: 'Roman Name', value: 'Venus' },
          { label: 'Born From', value: 'Sea Foam' },
          { label: 'Consort', value: 'Hephaestus' },
          { label: 'Domain', value: 'Love, Beauty, Desire' },
        ],
      },
    ],
  },
  {
    id: 'norse',
    label: 'Norse',
    region: 'Asgard',
    glyph: 'ᚱ',
    description: 'The Aesir and Vanir who ride toward Ragnarok — gods of war, wisdom, and the unrelenting winds of fate.',
    deities: [
      {
        name: 'Odin',
        title: 'Allfather',
        domain: 'Wisdom, War & Death',
        symbol: '👁',
        planet: 'Mercury',
        color: '220, 55%, 45%',
        description: 'The wandering god who sacrificed his eye at Mimir\'s well for cosmic wisdom, and hung nine days on Yggdrasil to learn the runes. Odin collects the worthy dead and prepares for Ragnarok.',
        details: [
          { label: 'Sacred Animal', value: 'Ravens Huginn & Muninn' },
          { label: 'Weapon', value: 'Gungnir' },
          { label: 'Mount', value: 'Sleipnir' },
          { label: 'Hall', value: 'Valhalla' },
          { label: 'Eye Sacrifice', value: "Mimir's Well" },
          { label: 'Runes', value: 'Elder Futhark' },
        ],
      },
      {
        name: 'Thor',
        title: 'God of Thunder',
        domain: 'Thunder, Strength & Protection',
        symbol: '⚡',
        planet: 'Jupiter',
        color: '42, 72%, 52%',
        description: 'The mightiest of the Aesir, Thor defends Midgard and the gods alike with his hammer Mjolnir. Where he rides, lightning splits the sky and giants tremble.',
        details: [
          { label: 'Weapon', value: 'Mjolnir' },
          { label: 'Belt', value: 'Megingjord' },
          { label: 'Day Named', value: 'Thursday' },
          { label: 'Mother', value: 'Jord (Earth)' },
          { label: 'Father', value: 'Odin' },
          { label: 'Goats', value: 'Tanngrisnir & Tanngnjóstr' },
        ],
      },
      {
        name: 'Freya',
        title: 'Goddess of Love & War',
        domain: 'Love, Fertility, War & Magic',
        symbol: '♀',
        planet: 'Venus',
        color: '345, 60%, 55%',
        description: 'Leader of the Valkyries and mistress of seidr magic, Freya is both lover and warrior. She weeps tears of gold for her absent husband and chooses half the battle-slain for her hall Sessrumnir.',
        details: [
          { label: 'Necklace', value: 'Brisingamen' },
          { label: 'Cloak', value: 'Falcon Feathers' },
          { label: 'Chariot', value: 'Drawn by Cats' },
          { label: 'Hall', value: 'Sessrumnir' },
          { label: 'Magic', value: 'Seidr' },
          { label: 'Brother', value: 'Freyr' },
        ],
      },
      {
        name: 'Loki',
        title: 'The Trickster',
        domain: 'Mischief, Fire & Transformation',
        symbol: '🔥',
        planet: 'Uranus',
        color: '15, 80%, 50%',
        description: 'Shape-shifter and agent of chaos, Loki walks the line between ally and betrayer. He aids the gods with cunning, but his machinations grow darker until he orchestrates the death of Baldur and seals the fate of Ragnarok.',
        details: [
          { label: 'Children', value: 'Fenrir, Jormungandr, Hel' },
          { label: 'Father', value: 'Farbauti (giant)' },
          { label: 'Bound', value: 'Until Ragnarok' },
          { label: 'Kills', value: 'Baldur (indirectly)' },
          { label: 'Ability', value: 'Shapeshifting' },
          { label: 'Fate', value: 'Fights at Ragnarok' },
        ],
      },
      {
        name: 'Tyr',
        title: 'God of Justice',
        domain: 'Law, Justice & War',
        symbol: '⚖',
        planet: 'Mars',
        color: '0, 55%, 50%',
        description: 'The one-handed god who sacrificed his right hand to bind Fenrir the wolf, ensuring the safety of the worlds. Tyr is the embodiment of honorable sacrifice for the greater good.',
        details: [
          { label: 'Sacrifice', value: 'Right Hand' },
          { label: 'Bound Fenrir', value: 'With Gleipnir' },
          { label: 'Day Named', value: 'Tuesday' },
          { label: 'Domain', value: 'Law, Justice, War' },
          { label: 'Fate', value: 'Dies at Ragnarok' },
          { label: 'Slain By', value: 'Garm' },
        ],
      },
      {
        name: 'Baldur',
        title: 'God of Light',
        domain: 'Light, Purity & Beauty',
        symbol: '✦',
        planet: 'Sun',
        color: '50, 90%, 58%',
        description: 'The most beloved of the Aesir, Baldur radiates light and goodness. His death by a mistletoe dart — engineered by Loki — plunges the gods into grief and marks the beginning of the end.',
        details: [
          { label: 'Father', value: 'Odin' },
          { label: 'Mother', value: 'Frigg' },
          { label: 'Hall', value: 'Breidablik' },
          { label: 'Killed By', value: 'Mistletoe' },
          { label: 'Returns After', value: 'Ragnarok' },
          { label: 'Brother', value: 'Hodr' },
        ],
      },
    ],
  },
  {
    id: 'egyptian',
    label: 'Egyptian',
    region: 'Kemet',
    glyph: '𓂀',
    description: 'The Netjeru of ancient Kemet — guardians of the Nile, the afterlife, and the eternal cycle of death and rebirth.',
    deities: [
      {
        name: 'Ra',
        title: 'God of the Sun',
        domain: 'Sun, Creation & Kingship',
        symbol: '☀',
        planet: 'Sun',
        color: '38, 90%, 55%',
        description: 'The supreme solar deity who sails his barque across the sky each day and through the Duat at night, battling the serpent Apep to ensure each sunrise. All pharaohs were his earthly sons.',
        details: [
          { label: 'Aspect', value: 'Khepri (dawn), Ra (noon), Atum (dusk)' },
          { label: 'Symbol', value: 'Solar Disk' },
          { label: 'Barque', value: 'Mandjet' },
          { label: 'Enemy', value: 'Apep the Serpent' },
          { label: 'Center', value: 'Heliopolis' },
          { label: 'Merged With', value: 'Amun (Amun-Ra)' },
        ],
      },
      {
        name: 'Osiris',
        title: 'God of the Dead',
        domain: 'Afterlife, Resurrection & Agriculture',
        symbol: '𓊃',
        planet: 'Pluto',
        color: '130, 50%, 30%',
        description: 'Slain by his brother Set and resurrected by Isis, Osiris became lord of the dead and symbol of eternal life. He judges souls in the Hall of Two Truths, weighing hearts against the feather of Ma\'at.',
        details: [
          { label: 'Killed By', value: 'Set' },
          { label: 'Resurrected By', value: 'Isis' },
          { label: 'Consort', value: 'Isis' },
          { label: 'Son', value: 'Horus' },
          { label: 'Symbol', value: 'Djed Pillar & Crook' },
          { label: 'Judgment', value: 'Hall of Two Truths' },
        ],
      },
      {
        name: 'Isis',
        title: 'Great Mother',
        domain: 'Magic, Healing & Protection',
        symbol: '𓃀',
        planet: 'Moon',
        color: '200, 60%, 48%',
        description: 'The most powerful magician in the Egyptian pantheon. Isis gathered the scattered pieces of her murdered husband Osiris, resurrected him, and conceived Horus — becoming the archetype of devoted mother and magical healer.',
        details: [
          { label: 'Symbol', value: 'Throne Hieroglyph & Wings' },
          { label: 'Husband', value: 'Osiris' },
          { label: 'Son', value: 'Horus' },
          { label: 'Magic', value: 'Heka (divine magic)' },
          { label: 'Tears', value: 'Caused the Nile flood' },
          { label: 'Roman Equivalent', value: 'Isis (unchanged)' },
        ],
      },
      {
        name: 'Anubis',
        title: 'Guardian of the Dead',
        domain: 'Mummification & the Afterlife',
        symbol: '⚖',
        planet: 'Saturn',
        color: '30, 40%, 30%',
        description: 'The jackal-headed guardian who oversees the embalming of the dead and guides souls through the Duat. Anubis places the heart on the scales against the feather of Ma\'at at the final judgment.',
        details: [
          { label: 'Head', value: 'Jackal' },
          { label: 'Role', value: 'Embalming, Guidance' },
          { label: 'Scales', value: 'Heart vs Ma\'at Feather' },
          { label: 'Greek Equivalent', value: 'Hermes Chthonios' },
          { label: 'Father', value: 'Osiris (or Ra)' },
          { label: 'Sacred Color', value: 'Black (resurrection)' },
        ],
      },
      {
        name: 'Thoth',
        title: 'God of Wisdom',
        domain: 'Knowledge, Writing & the Moon',
        symbol: '☽',
        planet: 'Mercury',
        color: '170, 45%, 42%',
        description: 'Ibis-headed scribe of the gods, keeper of divine records, and inventor of writing and mathematics. Thoth records the judgment of souls and settles disputes among the gods with impartial wisdom.',
        details: [
          { label: 'Head', value: 'Ibis (or Baboon)' },
          { label: 'Invention', value: 'Hieroglyphs & Science' },
          { label: 'Greek Equivalent', value: 'Hermes Trismegistus' },
          { label: 'Texts', value: 'Book of the Dead' },
          { label: 'Sacred City', value: 'Hermopolis' },
          { label: 'Role', value: 'Divine Scribe' },
        ],
      },
      {
        name: 'Horus',
        title: 'God of the Sky',
        domain: 'Sky, Kingship & Vengeance',
        symbol: '𓅃',
        planet: 'Sun',
        color: '42, 72%, 52%',
        description: 'Falcon-headed god of the sky and living embodiment of divine kingship. Son of Isis and Osiris, Horus avenged his father\'s murder by defeating Set and claiming the throne of Egypt. Every pharaoh ruled as Horus incarnate.',
        details: [
          { label: 'Head', value: 'Falcon' },
          { label: 'Eye', value: 'Wedjat (Eye of Horus)' },
          { label: 'Mother', value: 'Isis' },
          { label: 'Father', value: 'Osiris' },
          { label: 'Defeated', value: 'Set' },
          { label: 'Embodied By', value: 'The Pharaoh' },
        ],
      },
    ],
  },
  {
    id: 'japanese',
    label: 'Shinto',
    region: 'Nihon',
    glyph: '神',
    description: 'The Kami of the Japanese cosmos — nature spirits and divine ancestors who dwell in every mountain, river, and sacred space.',
    deities: [
      {
        name: 'Amaterasu',
        title: 'Great Divinity Illuminating Heaven',
        domain: 'Sun, Universe & Imperial Lineage',
        symbol: '☀',
        planet: 'Sun',
        color: '38, 90%, 55%',
        description: 'Supreme goddess of the sun and the universe, Amaterasu rules the High Plain of Heaven. The Imperial family of Japan traces its divine lineage to her. When her brother\'s chaos drove her into a cave, the world fell into darkness.',
        details: [
          { label: 'Realm', value: 'Takamagahara (High Heaven)' },
          { label: 'Sacred Item', value: 'Yata no Kagami (Mirror)' },
          { label: 'Shrine', value: 'Ise Grand Shrine' },
          { label: 'Brother', value: 'Susanoo' },
          { label: 'Lineage', value: 'Imperial Family' },
          { label: 'Hidden In', value: 'Ama-no-Iwato Cave' },
        ],
      },
      {
        name: 'Susanoo',
        title: 'God of Storms',
        domain: 'Sea, Storms & Chaos',
        symbol: '🌊',
        planet: 'Neptune',
        color: '200, 70%, 45%',
        description: 'Tempestuous god of storms and the sea, banished from heaven for his unruly behavior. After his exile, Susanoo became a hero — slaying the eight-headed serpent Yamata-no-Orochi and discovering the legendary sword Kusanagi.',
        details: [
          { label: 'Sword Found', value: 'Kusanagi-no-Tsurugi' },
          { label: 'Slew', value: 'Yamata-no-Orochi' },
          { label: 'Sister', value: 'Amaterasu' },
          { label: 'Domain', value: 'Storms, Sea, Poetry' },
          { label: 'Realm', value: 'Ne-no-Kuni (Root Land)' },
          { label: 'Parents', value: 'Izanagi & Izanami' },
        ],
      },
      {
        name: 'Tsukuyomi',
        title: 'God of the Moon',
        domain: 'Moon & Night',
        symbol: '☽',
        planet: 'Moon',
        color: '220, 50%, 60%',
        description: 'The moon god created from Izanagi\'s right eye. Tsukuyomi\'s act of killing the food goddess Uke Mochi so enraged Amaterasu that she refused to look upon him — and thus day and night were born, forever apart.',
        details: [
          { label: 'Born From', value: "Izanagi's Right Eye" },
          { label: 'Separated From', value: 'Amaterasu (day/night)' },
          { label: 'Killed', value: 'Uke Mochi (food goddess)' },
          { label: 'Domain', value: 'Moon, Night, Time' },
          { label: 'Realm', value: 'Night Sky' },
          { label: 'Aspect', value: 'Waxing & Waning' },
        ],
      },
      {
        name: 'Izanagi',
        title: 'The Male Who Invites',
        domain: 'Creation & Life',
        symbol: '🌸',
        planet: 'Jupiter',
        color: '160, 45%, 45%',
        description: 'One of the primordial creator deities who, with his consort Izanami, stirred the primordial waters with a jeweled spear and created the Japanese islands. After Izanami\'s death, Izanagi purified himself, birthing the greatest kami.',
        details: [
          { label: 'Consort', value: 'Izanami' },
          { label: 'Created', value: 'Japanese Islands' },
          { label: 'Tool', value: 'Naginata (jeweled spear)' },
          { label: 'Purification Birthed', value: 'Amaterasu, Tsukuyomi, Susanoo' },
          { label: 'Descended Into', value: 'Yomi (underworld)' },
          { label: 'Sealed', value: 'Yomi with a boulder' },
        ],
      },
      {
        name: 'Inari',
        title: 'God of Foxes & Harvest',
        domain: 'Rice, Fertility, Foxes & Industry',
        symbol: '🦊',
        planet: 'Venus',
        color: '15, 75%, 50%',
        description: 'One of the most widely venerated kami, Inari presides over rice, agriculture, foxes, and worldly success. Thousands of shrine gates (torii) mark their sanctuaries across Japan, guarded by fox messengers called kitsune.',
        details: [
          { label: 'Messengers', value: 'Kitsune (foxes)' },
          { label: 'Symbol', value: 'Rice sheaves & Fox' },
          { label: 'Shrines', value: '32,000+ across Japan' },
          { label: 'Domain', value: 'Rice, Industry, Success' },
          { label: 'Gender', value: 'Fluid (male, female, androgynous)' },
          { label: 'Main Shrine', value: 'Fushimi Inari, Kyoto' },
        ],
      },
      {
        name: 'Raijin',
        title: 'God of Thunder & Lightning',
        domain: 'Thunder, Lightning & Storms',
        symbol: '⚡',
        planet: 'Uranus',
        color: '42, 72%, 52%',
        description: 'The fierce deity of thunder and lightning, depicted as an oni-like figure surrounded by a ring of drums. Raijin beats his drums to create thunder, and often pairs with his companion Fujin, god of wind.',
        details: [
          { label: 'Companion', value: 'Fujin (Wind God)' },
          { label: 'Drums', value: 'Creates thunder' },
          { label: 'Appearance', value: 'Demon-like with drum ring' },
          { label: 'Children', value: 'Raijin\'s children' },
          { label: 'Parents', value: 'Izanagi & Izanami' },
          { label: 'Temple', value: 'Sensoji, Tokyo' },
        ],
      },
    ],
  },
]

// ── Carousel Component ────────────────────────────────────────────────────────
export default function MythologyCarousel() {
  const [activePantheon, setActivePantheon] = useState<string>(PANTHEONS[0].id)
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)

  const pantheon = PANTHEONS.find((p) => p.id === activePantheon)!
  const deities = pantheon.deities
  const deity = deities[activeIndex]

  const goTo = useCallback((idx: number, dir: 'left' | 'right') => {
    setDirection(dir)
    setActiveIndex(idx)
  }, [])

  const prev = () => {
    const idx = (activeIndex - 1 + deities.length) % deities.length
    goTo(idx, 'left')
  }

  const next = () => {
    const idx = (activeIndex + 1) % deities.length
    goTo(idx, 'right')
  }

  const selectPantheon = (id: string) => {
    setActivePantheon(id)
    setActiveIndex(0)
    setDirection(null)
  }

  // Positions: -2 -1 [0] +1 +2
  const getCardProps = (offset: number) => {
    const abs = Math.abs(offset)
    const scale = abs === 0 ? 1 : abs === 1 ? 0.82 : 0.66
    const translateX = offset * 260
    const rotateY = offset * 12
    const opacity = abs === 0 ? 1 : abs === 1 ? 0.65 : 0.3
    const zIndex = abs === 0 ? 20 : abs === 1 ? 10 : 5
    const blur = abs === 0 ? 0 : abs === 1 ? 0 : 2
    return { scale, translateX, rotateY, opacity, zIndex, blur }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* ── Pantheon Selector ── */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-14">
        {PANTHEONS.map((p) => (
          <button
            key={p.id}
            onClick={() => selectPantheon(p.id)}
            className={`group flex items-center gap-2.5 px-5 py-2.5 border transition-all duration-200 font-sans text-xs tracking-[0.25em] uppercase ${
              activePantheon === p.id
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border/60 text-muted-foreground hover:border-primary/50 hover:text-foreground'
            }`}
          >
            <span className="font-serif text-lg leading-none">{p.glyph}</span>
            <span>{p.label}</span>
            <span className="hidden sm:block text-[9px] opacity-50 tracking-widest">{p.region}</span>
          </button>
        ))}
      </div>

      {/* Pantheon tagline */}
      <p className="text-center font-sans text-sm text-muted-foreground max-w-lg mx-auto mb-12 leading-relaxed">
        {pantheon.description}
      </p>

      {/* ── 3D Carousel ── */}
      <div className="relative w-full" style={{ perspective: '1200px' }}>
        {/* Track */}
        <div className="relative flex items-center justify-center h-[420px]">
          {[-2, -1, 0, 1, 2].map((offset) => {
            const idx = ((activeIndex + offset) % deities.length + deities.length) % deities.length
            const d = deities[idx]
            const { scale, translateX, rotateY, opacity, zIndex, blur } = getCardProps(offset)
            const isCenter = offset === 0

            return (
              <div
                key={`${d.name}-${offset}`}
                className="absolute cursor-pointer select-none transition-all duration-500 ease-out"
                style={{
                  transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
                  opacity,
                  zIndex,
                  filter: blur > 0 ? `blur(${blur}px)` : 'none',
                  width: '240px',
                }}
                onClick={() => !isCenter && goTo(idx, offset > 0 ? 'right' : 'left')}
              >
                <div
                  className="relative w-full rounded-sm overflow-hidden border transition-all duration-300"
                  style={{
                    height: isCenter ? '380px' : '320px',
                    background: `hsl(230, 42%, 7%)`,
                    borderColor: isCenter
                      ? `hsl(${d.color} / 0.6)`
                      : `hsl(230, 25%, 16%)`,
                    boxShadow: isCenter
                      ? `0 0 40px hsl(${d.color} / 0.15), 0 8px 32px hsl(230,50%,2%,0.6)`
                      : 'none',
                  }}
                >
                  {/* Card top accent bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: `hsl(${d.color})`, opacity: isCenter ? 1 : 0.4 }}
                  />

                  {/* Deity symbol — large bg */}
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                    aria-hidden="true"
                  >
                    <span
                      className="font-serif font-black"
                      style={{
                        fontSize: '140px',
                        color: `hsl(${d.color})`,
                        opacity: 0.06,
                        lineHeight: 1,
                      }}
                    >
                      {d.symbol}
                    </span>
                  </div>

                  {/* Card content */}
                  <div className="relative z-10 flex flex-col h-full p-6 justify-between">
                    <div>
                      <p
                        className="font-sans text-[9px] tracking-[0.5em] uppercase mb-2"
                        style={{ color: `hsl(${d.color})` }}
                      >
                        {d.domain}
                      </p>
                      <h3 className="font-serif text-3xl font-bold text-foreground leading-tight">
                        {d.name}
                      </h3>
                      <p className="font-sans text-xs text-muted-foreground mt-1 tracking-wide">
                        {d.title}
                      </p>
                    </div>

                    <div className="flex items-end justify-between mt-4">
                      <span
                        className="font-serif text-5xl leading-none"
                        style={{ color: `hsl(${d.color})`, opacity: 0.7 }}
                      >
                        {d.symbol}
                      </span>
                      {d.planet && (
                        <span
                          className="font-sans text-[9px] tracking-[0.3em] uppercase px-2 py-1 border rounded-sm"
                          style={{
                            borderColor: `hsl(${d.color} / 0.3)`,
                            color: `hsl(${d.color})`,
                          }}
                        >
                          {d.planet}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Nav Arrows ── */}
        <button
          onClick={prev}
          aria-label="Previous deity"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-11 h-11 border border-border/60 bg-background/80 text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200 backdrop-blur-sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          aria-label="Next deity"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-11 h-11 border border-border/60 bg-background/80 text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200 backdrop-blur-sm"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {deities.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > activeIndex ? 'right' : 'left')}
              aria-label={`Go to ${deities[i].name}`}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === activeIndex ? 'w-6 bg-primary' : 'w-1.5 bg-border'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Deity Detail Panel ── */}
      <div
        key={`${activePantheon}-${deity.name}`}
        className="mt-16 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-400"
      >
        {/* Divider */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-border/50" />
          <span
            className="font-serif text-3xl"
            style={{ color: `hsl(${deity.color})` }}
          >
            {deity.symbol}
          </span>
          <div className="h-px flex-1 bg-border/50" />
        </div>

        <div className="text-center mb-8">
          <p
            className="font-sans text-[10px] tracking-[0.5em] uppercase mb-2"
            style={{ color: `hsl(${deity.color})` }}
          >
            {deity.domain}
          </p>
          <h2 className="font-serif text-5xl md:text-6xl font-bold text-foreground text-balance">
            {deity.name}
          </h2>
          <p className="font-sans text-muted-foreground text-sm tracking-widest mt-1">
            {deity.title}
          </p>
        </div>

        {/* Description */}
        <p className="font-sans text-foreground/80 text-base leading-relaxed text-center max-w-2xl mx-auto mb-12">
          {deity.description}
        </p>

        {/* Detail chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {deity.details.map(({ label, value }) => (
            <div
              key={label}
              className="spellbook-card p-4 rounded-sm"
            >
              <p
                className="font-sans text-[9px] tracking-[0.4em] uppercase mb-1"
                style={{ color: `hsl(${deity.color})` }}
              >
                {label}
              </p>
              <p className="font-sans text-sm text-foreground font-medium leading-snug">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
