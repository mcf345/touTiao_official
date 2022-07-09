declare module userInfo {

  export interface Data {
      id: string;
      name: string;
      photo: string;
      art_count: number;
      follow_count: number;
      fans_count: number;
      like_count: number;
  }

  export interface RootObject {
      data: Data;
      message: string;
  }

}

