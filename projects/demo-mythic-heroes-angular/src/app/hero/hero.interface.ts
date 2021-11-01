export interface Hero {
  heroId: string;
  heroName: string;
  heroImageUrl: string;
  factionId: string;
  rarityId: string;
  typeId: string;
  heroFaction: {
    factionId: string;
    factionName: string;
    factionImageUrl: string;
  };
  heroRarity: {
    rarityId: string;
    rarityName: string;
    rarityImageUrl: string;
  };
  heroType: {
    typeId: string;
    typeName: string;
    typeImageUrl: string;
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
