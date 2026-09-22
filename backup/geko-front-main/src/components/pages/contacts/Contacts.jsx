import contactArray from '../../../entities/contactArray'
import ContactInfo from '../shared/contact/ContactInfo'
import RegisterForm from "../home/RegisterForm";

export default function Contacts() {

    return (
        <main className="flex px-5 py-5 flex-col items-center">
            <div
                className="grid mid:grid-cols-3 w-full md:w-[auto] grid-cols-1 gap-[15px] items-center justify-items-center">
                {contactArray.map((value, index) => (
                    <ContactInfo
                        key={value.id}
                        value={value}
                        index={index}
                        Icon={value.Icon}
                    />
                ))}
            </div>
            <div className="flex mt-20 w-full flex-col items-center flex-wrap justify-center">
                <RegisterForm check={false}/>
            </div>

        </main>
    )
}
