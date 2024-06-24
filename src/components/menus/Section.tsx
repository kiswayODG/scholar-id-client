import { PropsWithChildren } from "react"

export interface sectionProps {

};

export const Section = (props:PropsWithChildren<{className?:string}>)  => {

    return(
        <section className={`${"max-w-6xl px-1 m-auto "+props.className}`}>
            {props.children}
        </section>
    )
}