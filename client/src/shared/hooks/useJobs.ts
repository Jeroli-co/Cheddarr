import { useEffect, useState } from "react";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";
import { IJob, JobActionsEnum } from "../models/IJob";
import { useAPI } from "./useAPI";
import { APIRoutes } from "../enums/APIRoutes";
import { useAlert } from "../contexts/AlertContext";

export const useJobs = () => {
  const [jobs, setJobs] = useState<IAsyncCall<IJob[] | null>>(DefaultAsyncCall);
  const { get, patch } = useAPI();
  const { pushInfo, pushDanger } = useAlert();

  useEffect(() => {
    get<IJob[]>(APIRoutes.JOBS()).then((res) => setJobs(res));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const patchJob = (id: string, action: JobActionsEnum) => {
    patch<IJob>(APIRoutes.JOBS(id), { action: action }).then((res) => {
      if (res.status === 200) {
        pushInfo("Job state: " + action);
        const jobsTmp = jobs.data;
        if (jobsTmp && res.data) {
          const index = jobsTmp.findIndex((j) => j.id === id);
          if (index !== -1) {
            jobsTmp.splice(index, 1, res.data);
            setJobs({ ...jobs, data: [...jobsTmp] });
          }
        }
      } else {
        pushDanger("Cannot patch job");
      }
      return res;
    });
  };

  return {
    jobs,
    patchJob,
  };
};
