// ----------------------------------------------------------------------
export type IOrderProps = {
  _id: string;
  company: string;
  user: string;
  relative: {
    _id: string;
    name: string;
    birthdate: string;
    profile_picture?: string;
    medical_conditions: string;
    gender: string;
    kinship: string;
  };
  caregiver: {
    // _id: string;
    name: string;
    gender?: string;
    birthdate?: string;
    profile_picture?: string;
  };
  services: [];
  schedule_information: {
    start_date: string;
    end_date?: string;
    recurrency: number;
    schedule: [
      {
        week_day: number;
        start: string;
        end: string;
      }
    ];
  };
  status: string;
  address: {
    street: string;
    postal_code: string;
    city: string;
    state?: string;
    country: string;
  };
};

export type IScheduleProps = {
  week_day: number;
  start: Date | null;
  end: Date | null;
  nightService?: boolean;
  valid?: boolean | null;
};
