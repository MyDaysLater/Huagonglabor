import request from './request';
export async function get_dict_list() {
    return await request.get('/dashboard/dictionary');
}

export async function dict_select(id) {
    let selectdata = [{
        title: '',
        value: '',
        disabled: true,
        children: [],
    }];
    let dict_items = JSON.parse(localStorage.getItem('dict'))
    selectdata[0].title = dict_items[id].title;
    selectdata[0].value = dict_items[id].id;
    if (dict_items[id].children) {
        selectdata[0].children = selectdatas(selectdata[0].children, dict_items[id].children, 0);
    }
    return selectdata;
}
function selectdatas(selectarr, arr, index) {
    for (var item in arr) {
        if (arr[item].children) {
            selectarr.push(
                {
                    title: arr[item].title,
                    value: arr[item].id,
                    disabled: true,
                    children: []
                }
            )
        } else {
            selectarr.push(
                {
                    title: arr[item].title,
                    expand: false,
                    value: arr[item].id,
                    selected: false,
                    checked: false,
                    children: []
                }
            )
        }
        if (arr[item].children) {
            selectarr[index].children = selectdatas(selectarr[index].children, arr[item].children, 0);
        }
        index++;
    }
    return selectarr;
}
export default {
    get_dict_list,
    dict_select
}