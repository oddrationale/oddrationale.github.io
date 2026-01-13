import pluginWebc from "@11ty/eleventy-plugin-webc";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginWebc);

  return {
    dir: {
      input: "src",
      output: "_site",
    },
  };
}
