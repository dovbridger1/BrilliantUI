export const Expand = (emails) => {
    return {
        type: "EXPAND",
        emails: emails
    };
}

export const Delete = (id) => {
    return {
        type: "DELETE",
        id: id
    };
}

export const Reset = () => {
    return {
        type: "RESET"
    };
}

