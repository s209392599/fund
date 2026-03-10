/**
 * 项目管理  - 项目架构 -- 重大专项 - 重大任务 共用
 *
 * 作者 ganjun
 * 日期 2024-09-23 14:54:23
 */

/*
OrgChart.js修改日志
6.11: 添加代码[ ?.replaceAll(',NaN','')  ]
6.12: 修改代码[ .replaceAll('NaN',+(t.getAttribute("viewBox").split(',')[2])-500)  ]

*/
// layui.use(['jquery'], function () {

    // =========== 多任务
    get_data();

    function get_data () {
        // let res = {
        //     "code": 200,
        //     "data": [
        //         {
        //             "company": "中远海运重工",
        //             "projectNames": "m",
        //             "levenName": "专项",
        //             "id": "65587175035d4b41905b98721e4e8e5c",
        //             "parentId": "0",
        //             "projectIds": null
        //         }
        //     ]
        // }

        let res = {
            "code": 200,
            "data": [
                {
                    "company": "中远海运重工",
                    "projectNames": "20260204",
                    "levenName": null,
                    "id": "3d0429b37c627620b6d0ec65dfde5d45",
                    "parentId": "000",
                    "projectIds": [
                        "3d0429b37c627620b6d0ec65dfde5d45"
                    ]
                },
                {
                    "company": "扬州重工",
                    "projectNames": "1111",
                    "levenName": null,
                    "id": "34b8f696d43ffb105fcdebe71b0a44d3",
                    "parentId": "3d0429b37c627620b6d0ec65dfde5d45",
                    "projectIds": [
                        "34b8f696d43ffb105fcdebe71b0a44d3"
                    ]
                },
                {
                    "company": "南通川崎",
                    "projectNames": "22222",
                    "levenName": null,
                    "id": "2186a47e4b9ce22c2d3afe951aa86a5c",
                    "parentId": "3d0429b37c627620b6d0ec65dfde5d45",
                    "projectIds": [
                        "2186a47e4b9ce22c2d3afe951aa86a5c"
                    ]
                }
            ]
        }

        let arr = res.data || [];
        let nodes = [];

        let num = 100;
        num = 300;
        for(let i = 0; i < num; i++) {
            arr.push({
                "company": "中远海运重工" + i,
                "projectNames": "20260204",
                "levenName": null,
                "id": "3d0429b37c627620b6d0ec65dfde5d4" + i,
                "parentId": "000",
                "projectIds": [
                    "3d0429b37c627620b6d0ec65dfde5d45"
                ]
            });
        }

        arr.map(item => {
            nodes.push({
                ...item,
                tags: [""],
                pid: item.parentId,
                name: item.levenName,
                title: item.projectNames,
                info: item.company ? "(" + item.company + ")" : '',
            })
        })
        init_chart(nodes);
    }

    function init_chart (nodes) {
        // if (OrgChart) console.log('OrgChart---', OrgChart)
        const blue_color = '#2196f3';
        const org_color = '#ffed5e';
        const org_bg_color = 'orange';
        OrgChart.templates.greyTemplate = Object.assign({}, OrgChart.templates.ula);

        OrgChart.templates.greyTemplate.size = originFrom == 'zdzx' ? [250, 110] : [250, 80]; // [250, 105] if you need plus-minus button
        const h_num = originFrom == 'zdzx' ? 100 : 70;
        OrgChart.templates.greyTemplate.node =
            `<rect x="0" y="5" height="${h_num}" width="{w}" fill="${blue_color}" stroke-width="1" stroke="${blue_color}" rx="5" ry="5"></rect>`;
        if (originFrom == 'zdzx') {
            OrgChart.templates.greyTemplate.node +=
            ` <rect x="10" y="10" height="30" width="230" fill="${org_bg_color}" stroke-width="1" stroke="${org_color}" rx="5" ry="5"></rect>`;
        }
        OrgChart.templates.greyTemplate.node += `<line x1="0" y1="40" x2="250" y2="40" stroke-width="1" stroke="${blue_color}"></line>`;

        OrgChart.templates.greyTemplate.link =
            `<path stroke-linejoin="round" stroke="#616161" stroke-width="1px" fill="none" d="{edge}" />`;
        OrgChart.templates.greyTemplate.field_0 =
            `<text width="230" style="font-size: 18px;" fill="#ffffff" x="125" y="30" text-anchor="middle">{val}</text>`;
        const y_num = originFrom == 'zdzx' ? 65 : 30;
        OrgChart.templates.greyTemplate.field_1 =
            `<text
                width="230"
                style="
                    font-size: 18px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    width: 230px;
                    font-weight="bold;"
                fill="#ffffff"
                x="125" y="${y_num}"
                text-anchor="middle">{val}</text>`;
        const y_2_num = originFrom == 'zdzx' ? 90 : 60;
        OrgChart.templates.greyTemplate.field_2 =
            `<text width="230" style="font-size: 16px;" fill="${org_color}" x="125" y="${y_2_num}" text-anchor="middle">{val}</text>`;
        OrgChart.templates.greyTemplate.plus = ``;
        OrgChart.templates.greyTemplate.minus = ``;

        nodeBinding = {
            field_0: "name",
            field_1: "title",
            // field_2: "info",
        }
        let content_id = document.getElementById("zdrw_tree");
        if (originFrom == 'zdzx') {
            nodeBinding.field_2 = "info";
            content_id = document.getElementById("zdzx_tree");
        }
        let chart = new OrgChart(content_id, {
            // mouseScrool: OrgChart.action.scroll,
            mouseScrool: OrgChart.action.ctrlZoom,
            enableDragDrop: false,
            enableSearch: false,
            enableAI: true,
            template: "ula", // 使用适合自适应的模板
            scaleInitial: OrgChart.match.boundary, // 自动匹配边界
            nodeBinding: {
                field_0: "name",
                field_1: "title",
                field_2: "info",
            },
            tags: {
                "": {
                    template: "greyTemplate"
                }
            },
            toolbar: {
                fullScreen: true,
                zoom: true,
                fit: true,
                // expandAll: true
            },
        });

        console.log('nodes length:', nodes.length);
        chart.load(nodes);
        chart.fit(); // 数据加载完成后适应
    }
// });
