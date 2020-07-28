import request from './request';

export async function getconfigs(params) {
    return await request.get(`/corp-config`, {
        params,
    });
}
export async function putconfig(id, params) {
    return await request.put(`/corp-config/${id}`, params);
}

// 列表
export async function getprojectitems(params) {
    return await request.get('corp-project', {
        params
    })
}

export async function baselist(params) {
    return await request.get('corp-base', {
        params
    })
}

export async function memberlist(params) {
    return await request.get('corp-project-member', {
        params
    })
}

export async function recordlist(params) {
    return await request.get('record', {
        params
    })
}


// 公司
export async function gejzgrCorp_list(params) {
    return await request.get(`/jzgr-corp`, {
        params
    });
}
export async function synchronousCorp(params) {
    return await request.post(`/v2/jzgr-corp/synchronous`, params);
}
export async function upload_Corp(params) {
    return await request.post(`/v2/jzgr-corp/corp-upload`, params);
}
export async function jzgrCorp_info(id) {
    return await request.get(`/jzgr-corp/${id}`);
}

// 项目
export async function jzgrProjectlist(params) {
    return await request.get(`/jzgr-project`, {
        params
    });
}
export async function synchronousProject(params) {
    return await request.post(`/v2/jzgr-project/synchronous`, params);
}
export async function upload_project(params) {
    return await request.post(`/v2/jzgr-project/project-add`, params);
}
export async function jzgrproject_info(id) {
    return await request.get(`/jzgr-project/${id}`);
}
export async function query_project(params) {
    return await request.get(`/v2/jzgr-project/project-query`, {
        params
    });
}
export async function result_query_project(params) {
    return await request.get(`/v2/jzgr-project/async-handle-result-query`, {
        params
    });
}


// 参建
export async function jzgrcontractor_getlist(params) {
    return await request.get(`/jzgr-project-sub-contractor`, {
        params
    });
}
export async function jzgrcontractor_post(params) {
    return await request.post(`/jzgr-project-sub-contractor`, params);
}
export async function sync_contractor(params) {
    return await request.post(`/v2/jzgr-project-sub-contractor/synchronous`, params);
}
export async function upload_contractor(params) {
    return await request.post(`/v2/jzgr-project-sub-contractor/project-sub-contractor-add`, params);
}
export async function update_contractor(id, params) {
    return await request.put(`/jzgr-project-sub-contractor/${id}`, params);
}
export async function jzgrcontractor_info(id) {
    return await request.get(`/jzgr-project-sub-contractor/${id}`);
}
export async function query_contractor(params) {
    return await request.get(`/v2/jzgr-project-sub-contractor/project-sub-contractor-query`, {
        params
    });
}

// 班组
export async function jzgrteam_getlist(params) {
    return await request.get(`/jzgr-project-team`, {
        params
    });
}
export async function sync_team(params) {
    return await request.post(`/v2/jzgr-project-team/synchronous`, params);
}
export async function post_team(params) {
    return await request.post(`/jzgr-project-team`, params);
}
export async function update_team(id, params) {
    return await request.put(`/jzgr-project-team/${id}`, params);
}
export async function team_info(id) {
    return await request.get(`/jzgr-project-team/${id}`);
}
export async function upload_team(params) {
    return await request.post(`/v2/jzgr-project-team/project-team-add`, params);
}
export async function result_query_team(params) {
    return await request.get(`/v2/jzgr-project-team/async-handle-result-query`, {
        params
    });
}
export async function query_team(params) {
    return await request.get(`/v2/jzgr-project-team/project-team-query`, {
        params
    });
}

// 人员
export async function worker_list(params) {
    return await request.get(`/jzgr-project-worker`, {
        params
    });
}
export async function sync_worker(params) {
    return await request.post(`/v2/jzgr-project-worker/synchronous`, params);
}
export async function post_worker(params) {
    return await request.post(`/jzgr-project-worker`, params);
}
export async function update_worker(id, params) {
    return await request.put(`/jzgr-project-worker/${id}`, params);
}
export async function worker_info(id) {
    return await request.get(`/jzgr-project-worker/${id}`);
}
export async function upload_worker(params) {
    return await request.post(`/v2/jzgr-project-worker/project-worker-add`, params);
}
export async function query_worker(params) {
    return await request.get(`/v2/jzgr-project-worker/project-worker-query`, {
        params
    });
}

// 进退场
export async function entryexit_list(params) {
    return await request.get(`/jzgr-project-worker-entry-exit`, {
        params
    });
}
export async function sync_entryexit(params) {
    return await request.post(`/v2/jzgr-project-worker-entry-exit/synchronous`, params);
}
export async function post_entryexit(params) {
    return await request.post(`/jzgr-project-worker-entry-exit`, params);
}
export async function update_entryexit(id, params) {
    return await request.put(`/jzgr-project-worker-entry-exit/${id}`, params);
}
export async function entryexit_info(id) {
    return await request.get(`/jzgr-project-worker-entry-exit/${id}`);
}
export async function upload_entryexit(params) {
    return await request.post(`/v2/jzgr-project-worker-entry-exit/worker-entry-exit-add`, params);
}
export async function query_entryexit(params) {
    return await request.get(`/v2/jzgr-project-worker-entry-exit/worker-entry-exit-query`, {
        params
    });
}

// 合同
export async function contract_list(params) {
    return await request.get(`/jzgr-project-worker-contract`, {
        params
    });
}
export async function sync_contract(params) {
    return await request.post(`/v2/jzgr-project-worker-contract/synchronous`, params);
}
export async function post_contract(params) {
    return await request.post(`/jzgr-project-worker-contract`, params);
}
export async function update_contract(id, params) {
    return await request.put(`/jzgr-project-worker-contract/${id}`, params);
}
export async function contract_info(id) {
    return await request.get(`/jzgr-project-worker-contract/${id}`);
}
export async function upload_contract(params) {
    return await request.post(`/v2/jzgr-project-worker-contract/worker-contract-add`, params);
}
export async function query_contract(params) {
    return await request.get(`/v2/jzgr-project-worker-contract/worker-contract-query`, {
        params
    });
}

// 考勤
export async function attendance_list(params) {
    return await request.get(`/jzgr-project-worker-attendance`, {
        params
    });
}
export async function sync_attendance(params) {
    return await request.post(`/v2/jzgr-project-worker-attendance/synchronous`, params);
}
export async function post_attendance(params) {
    return await request.post(`/jzgr-project-worker-attendance`, params);
}
export async function update_attendance(id, params) {
    return await request.put(`/jzgr-project-worker-attendance/${id}`, params);
}
export async function attendance_info(id) {
    return await request.get(`/jzgr-project-worker-attendance/${id}`);
}
export async function upload_attendance(params) {
    return await request.post(`/v2/jzgr-project-worker-attendance/worker-attendance-add`, params);
}
export async function query_attendance(params) {
    return await request.get(`/v2/jzgr-project-worker-attendance/worker-attendance-query`, {
        params
    });
}


// 工资
export async function payroll_list(params) {
    return await request.get(`/jzgr-project-worker-payroll`, {
        params
    });
}
export async function sync_payroll(params) {
    return await request.post(`/v2/jzgr-project-worker-payroll/synchronous`, params);
}
export async function post_payroll(params) {
    return await request.post(`/jzgr-project-worker-payroll`, params);
}
export async function update_payroll(id, params) {
    return await request.put(`/jzgr-project-worker-payroll/${id}`, params);
}
export async function payroll_info(id) {
    return await request.get(`/jzgr-project-worker-payroll/${id}`);
}
export async function upload_payroll(params) {
    return await request.post(`/v2/jzgr-project-worker-payroll/payroll-add`, params);
}
export async function query_payroll(params) {
    return await request.get(`/v2/jzgr-project-worker-payroll/payroll-query`, {
        params
    });
}
export async function result_query_payroll(params) {
    return await request.get(`/v2/jzgr-project-worker-payroll/async-handle-result-query`, {
        params
    });
}

// 培训
export async function training_list(params) {
    return await request.get(`/jzgr-project-training`, {
        params
    });
}
export async function sync_training(params) {
    return await request.post(`/v2/jzgr-project-training/synchronous`, params);
}
export async function post_training(params) {
    return await request.post(`/jzgr-project-training`, params);
}
export async function update_training(id, params) {
    return await request.put(`/jzgr-project-training/${id}`, params);
}
export async function training_info(id) {
    return await request.get(`/jzgr-project-training/${id}`);
}
export async function upload_training(params) {
    return await request.post(`/v2/jzgr-project-training/training-add`, params);
}
export async function query_training(params) {
    return await request.get(`/v2/jzgr-project-training/training-query`, {
        params
    });
}


export default {
    getconfigs,
    putconfig,
    getprojectitems,
    baselist,
    memberlist,
    recordlist,
    gejzgrCorp_list,
    synchronousCorp,
    jzgrProjectlist,
    synchronousProject,
    jzgrcontractor_post,
    jzgrcontractor_getlist,
    sync_contractor,
    jzgrteam_getlist,
    post_team,
    sync_worker,
    sync_team,
    post_worker,
    worker_list,
    sync_entryexit,
    post_entryexit,
    entryexit_list,
    contract_list,
    sync_contract,
    post_contract,
    attendance_list,
    sync_attendance,
    post_attendance,
    payroll_list,
    sync_payroll,
    post_payroll,
    training_list,
    sync_training,
    post_training,
};