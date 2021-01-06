export class Contact {
    static contact_dict = {};
    static create_contact(recipient_object, image_link) {
        const address = recipient_object['emailAddress']['address']
        if (Contact.contact_dict[address]) {
            return Contact.contact_dict[address]
        } else {
            this.contact_dict[address] = new Contact(recipient_object, image_link)
            return this.contact_dict[address]
        }

    }
    static get_contact_name_by_address(address) {
        const contact = Contact.contact_dict[address]
        return contact ? contact.get_name() : null
    }

    static get_filtered_contacts(sub_address, max_num = 7) {
        const all_addresses = Object.keys(Contact.contact_dict);
        return all_addresses.filter(a => a.search(sub_address) !== -1)
    }

    constructor(recipient_object, image_link) {
        this.recipient = recipient_object;
        this.image_link = image_link ? image_link : 'person_images/' + Object.keys(Contact.contact_dict).length + ".jpg";
        Contact.contact_dict[this.get_address()] = this;
    }
    get_address() {
        return this.recipient['emailAddress']['address'];
    }

    get_name() {
        return this.recipient['emailAddress']['name'];
    }

    get_icon() {
        return this.image_link;
    }
    equals(other) {
        return this.get_address() == other.get_address();
    }

    get_initials() {
        var initials = ""
        for (const name of this.get_name().split(' ')) {
            initials = initials + name[0] + ".";
        }
        return initials;
    }
}

export const person0 = Contact.create_contact({
    'emailAddress': {
        'address': 'dovbridger@itsbrilliant.com',
        'name': 'Dov Bridger'
    }
})