const resolveAxios = request =>
  Promise.resolve({
    data: request
  });

const rejectAxios = () => Promise.reject({ code: -1 });

const resolveAxiosWithNoData = () =>
  Promise.resolve({});

export default {
  resolveAxios,
  rejectAxios,
  resolveAxiosWithNoData
};
