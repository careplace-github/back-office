// ----------------------------------------------------------------------

type IReviewUsers = {
  id: string;
  name: string;
  avatarUrl: string;
};

export type IReviewItemProp = {
  id: string;
  name: string;
  rating: number;
  postedAt: Date | string | number;
  message: string;
  helpful: number;
  avatarUrl: string;
  users: IReviewUsers[];
};
