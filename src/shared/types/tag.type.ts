export const TagType = {
  specialty: "specialty",
  style: "style",
} as const;

export type TagType = (typeof TagType)[keyof typeof TagType];

export interface Tag {
  id: string;
  name: string;
  slug?: string;
  type: TagType;
}
