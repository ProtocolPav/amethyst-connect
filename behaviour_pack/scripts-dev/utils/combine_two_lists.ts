

export default function combine(list1: { [key: string]: any }[], list2: { [key: string]: any }[], id: string) {
    let combined_list = []

    for (let item of list1) {
        combined_list.push({...item, ...list2.find(item2 => item2[id] === item[id])})
    }

    return combined_list
}