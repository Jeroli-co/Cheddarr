import { useEffect, useState } from "react";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";
import { useAPI } from "./useAPI";
import { APIRoutes } from "../enums/APIRoutes";
import { ISeries } from "../models/IMedia";
import { useAlert } from "../contexts/AlertContext";

export const useSeries = (seriesId: number) => {
  const [series, setSeries] = useState<IAsyncCall<ISeries | null>>(
    DefaultAsyncCall
  );
  const { get } = useAPI();
  const { pushDanger } = useAlert();

  useEffect(() => {
    get<ISeries>(APIRoutes.GET_SERIES(seriesId)).then((res) => {
      if (res.status !== 200) {
        pushDanger("Cannot get series");
      } else {
        setSeries(res);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seriesId]);

  return series;
};
