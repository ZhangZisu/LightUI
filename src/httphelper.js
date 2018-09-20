import store from "./store";
import { stringify } from "querystring";
import { pbkdf2Sync } from "crypto-browserify";
import axios from "axios";

export const getURL = (base, query) => {
  if (!(query instanceof Object)) query = {};
  for (let name in query) if (query[name] === null) delete query[name];
  if (store.state.accessToken) {
    query.c = store.state.clientID;
    query.a = store.state.accessToken;
  }
  return base + "?" + stringify(query);
};

export const Paginate = (itemsPerPage, page) => {
  return {
    skip: (page - 1) * itemsPerPage,
    limit: itemsPerPage
  };
};

export const getPURL = (base, query, itemsPerPage, page) => {
  const realQuery = {};
  Object.assign(realQuery, query, Paginate(itemsPerPage, page));
  return getURL(base, realQuery);
};

export const get = async url => {
  try {
    const res = await axios.get(url);
    if (res.data.status === "success") {
      return res.data.payload;
    } else {
      throw new Error(res.data.payload);
    }
  } catch (e) {
    store.commit("updateError", e.message);
    throw e;
  }
};

export const post = async (url, data) => {
  try {
    const res = await axios.post(url, data);
    if (res.data.status === "success") {
      return res.data.payload;
    } else {
      throw new Error(res.data.payload);
    }
  } catch (e) {
    store.commit("updateError", e.message);
    throw e;
  }
};
