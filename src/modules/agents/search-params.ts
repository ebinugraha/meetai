import { DEFAULT_PAGE } from "@/constant";
import { parseAsInteger, parseAsString, createLoader } from "nuqs/server";

export const SearchParamsAgentsFilters = {
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  page: parseAsInteger
    .withDefault(DEFAULT_PAGE)
    .withOptions({ clearOnDefault: true }),
};

export const loadsearchParams = createLoader(SearchParamsAgentsFilters);
