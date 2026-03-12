type TagType = 'Agent' | 'Ships' | 'Ship' | 'Contracts' | 'Contract' | 'Waypoints' | 'Waypoint';

export type TagDescriptor<T extends TagType = TagType> = {
  type: T
  id: string
}

export function listTag<T extends TagType>(type: T): TagDescriptor<T> {
  return { type, id: 'LIST' };
}

export function entityTag<T extends TagType>(type: T, id: string): TagDescriptor<T> {
  return { type, id };
}

export function providesList<Tag extends TagType>(type: Tag) {
  return [listTag(type)] as const;
}

export function providesEntity<Tag extends TagType>(
  type: Tag,
  id: string,
) {
  return [entityTag(type, id)] as const;
}

export function providesEntityList<
  ListTag extends TagType,
  ItemTag extends TagType,
  TItem,
>(
  listType: ListTag,
  itemType: ItemTag,
  items: readonly TItem[] | undefined,
  getId: (item: TItem) => string,
) {
  if (!items) {
    return [listTag(listType)] as const;
  }

  return [
    ...items.map((item) => entityTag(itemType, getId(item))),
    listTag(listType),
  ] as const;
}

export function invalidatesTags(...tags: TagDescriptor[]) {
  return tags;
}


