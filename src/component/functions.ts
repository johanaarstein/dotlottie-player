import { strFromU8, unzip } from 'fflate'
import { Buffer } from 'buffer'

import type {
  Unzipped
} from 'fflate'
import type {
  LottieAssets,
  LottieManifest,
  ObjectFit
} from './types'

const aspectRatio = (objectFit: ObjectFit) => {
  switch (objectFit) {
    case 'contain':
    case 'scale-down':
      return 'xMidYMid meet';
    case 'cover':
      return 'xMidYMid slice';
    case 'fill':
      return 'none';
    case 'none':
      return 'xMinYMin slice';
    default:
      return 'xMidYMid meet';
  }
},

  fetchPath = async (path: string): Promise<JSON> => {
    const ext = path.split('.').pop()?.toLowerCase()
    let status = 200

    try {
      const result = await fetch(path)

      status = result.status

      if (ext === 'json')
        return await result.json()

      const buffer = new Uint8Array(await result.arrayBuffer()),
        unzipped = await new Promise<Unzipped>((resolve, reject) => {
          unzip(buffer, (err, file) => {
            if (err) reject(err)
            resolve(file)
          })
        }),

        manifestFile = strFromU8(unzipped['manifest.json']),
        manifest: LottieManifest = JSON.parse(manifestFile)

      if (!('animations' in manifest))
        throw new Error('Manifest not found')
      if (!manifest.animations.length)
        throw new Error('No animations listed in manifest')

      const { id } = manifest.animations[0],

        lottieString = strFromU8(unzipped?.[`animations/${id}.json`]),
        lottieJson = await JSON.parse(lottieString)

      if ('assets' in lottieJson) {
        Promise.all(lottieJson.assets.map((asset: LottieAssets) => {

          const { p } = asset

          if (!p || !unzipped?.[`images/${p}`]) return

          return new Promise<void>(resolveAsset => {
            const ext = p.split('.').pop(),
              assetB64 = Buffer.from(unzipped?.[`images/${p}`])?.toString('base64')

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
      if (status === 404) {
        throw new Error('File not found')
      } else {
        throw new Error('Unable to load file')
      }
    }
  }

export { aspectRatio, fetchPath }