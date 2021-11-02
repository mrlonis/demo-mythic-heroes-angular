export interface MythicHero {
  id: string;
  name: string;
  imageUrl: string;
  factionId: string;
  rarityId: string;
  typeId: string;
  faction: {
    id: string;
    name: string;
    imageUrl: string;
  };
  rarity: {
    id: string;
    name: string;
    imageUrl: string;
  };
  type: {
    id: string;
    name: string;
    imageUrl: string;
  };
  _links: {
    self: {
      href: string;
    };
    mythicHeroes: {
      href: string;
    };
  };
}
