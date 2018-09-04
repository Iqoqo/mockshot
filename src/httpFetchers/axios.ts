interface Axios {
  response: {
    config: {
      method: string;
      url: string;
    };
    status: number;
    data: any;
  };
}

function instanceOfA(fetchLibrary: any): fetchLibrary is Axios {
  return "response" in object && "response.config" in object && ;
}
