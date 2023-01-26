import { strFromU8, unzip } from 'fflate'

import { LottieAnimation, LottieAssets, LottieManifest } from './types.d'

export async function fetchPath(path: string): Promise<JSON> {
  const ext: string | undefined = path.split('.').pop()?.toLowerCase()

  try {
    const result: Response = await fetch(path)

    if (ext === 'json') return await result.json()

    const buffer = new Uint8Array(await result.arrayBuffer()),
      unzipped = await new Promise((resolve, reject) => {
        unzip(buffer, (err, file) => {
          if (err) reject(err)
          resolve(file)
        })
      }),

      // TODO: Hack for TypeScript
      lottieAnimation = unzipped as LottieAnimation,

      manifestFile: string | undefined = strFromU8(lottieAnimation['manifest.json']),
      manifest: LottieManifest = JSON.parse(manifestFile as string)

    if (!('animations' in manifest)) throw new Error('Manifest not found')
    if (!manifest.animations.length) throw new Error('No animations listed in the manifest')

    const { id } = manifest.animations[0],

      lottieString = strFromU8(lottieAnimation?.[`animations/${id}.json`]),
      lottieJson = await JSON.parse(lottieString as string)

    if ('assets' in lottieJson) {
      Promise.all(lottieJson.assets.map((asset: LottieAssets) => {

        const { p } = asset

        if (!p || !lottieAnimation?.[`images/${p}`]) return

        return new Promise<void>((resolveAsset) => {
          const ext = p.split('.').pop(),
            assetB64 = Buffer.from(lottieAnimation?.[`images/${p}`])?.toString('base64')

          switch (ext) {
            case 'svg':
            case 'svg+xml':
              asset.p = `data:image/svg+xml;base64,${assetB64}`
              break
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
            case 'webp':
              asset.p = `data:image/${ext};base64,${assetB64}`
              break
            default:
              asset.p = `data:;base64,${assetB64}`
          }

          asset.e = 1

          resolveAsset()
        })
      }))
    }

    return lottieJson

  } catch (err) {
    throw new Error('Error loading Lottie file.')
  }
}