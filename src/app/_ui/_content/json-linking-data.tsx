
import Head from 'next/head'
import { WithContext, Thing } from 'schema-dts'

type LinkingDataProps<T extends Thing> = {
  jsonLd: WithContext<T>
}


export default function JsonLinkingData<T extends Thing>(props: LinkingDataProps<T>) {
    return (
      <section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(props.jsonLd) }}
        />
      </section>
    )
}
