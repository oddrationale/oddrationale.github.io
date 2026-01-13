import pluginWebc from "@11ty/eleventy-plugin-webc";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginWebc);

  // Copy all files from static folder to root of _site
  eleventyConfig.addPassthroughCopy({ "src/static": "/" });

  return {
    dir: {
      input: "src",
      output: "_site",
    },
  };
}
