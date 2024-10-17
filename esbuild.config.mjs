import esbuild from "esbuild"
import wasmPlugin from "./.esbuild/wasmPlugin.mjs"

const context = await esbuild.context({
  entryPoints: ["./app/javascript/application.js"],
  outdir: "app/assets/builds",
  bundle: true,
  allowOverwrite: true,
  sourcemap: true,
  publicPath: '/assets',
  plugins: [wasmPlugin],
})

if (process.argv.includes('--watch') && process.env.NODE_ENV !== 'production') {
  await context.watch()
} else {
  await context.rebuild()
  process.exit(0)
}
