
import { makePluginByCombiningPlugins } from "graphile-utils";
import InflectionPlugin from "./inflection-plugin";
import AddAggregatesPlugin from "./aggregates-plugin";

export const AggregatesPlugin = [
    makePluginByCombiningPlugins(
        InflectionPlugin,
        AddAggregatesPlugin
    )
]