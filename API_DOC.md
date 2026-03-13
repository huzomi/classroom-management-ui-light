# 后端接口文档

> 本文档涵盖 `org.jeecg.modules.common.controller` 和 `org.jeecg.modules.edu.controller` 下所有接口。
> 所有接口统一返回格式为 `Result<T>`，前端需根据此格式解析响应。

---

## 通用说明

### 统一响应格式 `Result<T>`

```json
{
  "success": true,
  "message": "操作成功",
  "code": 200,
  "result": "<T 对应的数据>",
  "timestamp": 1700000000000
}
```

### 分页响应格式 `IPage<T>`

当接口返回 `Result<IPage<T>>` 时，`result` 字段结构如下：

```json
{
  "records": [ /* T 的数组 */ ],
  "total": 100,
  "size": 10,
  "current": 1,
  "pages": 10
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| records | Array\<T\> | 当前页数据列表 |
| total | Long | 总记录数 |
| size | Long | 每页大小 |
| current | Long | 当前页码 |
| pages | Long | 总页数 |

### 通用 DTO

#### CommonDeleteIdsDTO（通用删除请求）

> 注意：`org.jeecg.modules.common` 和 `org.jeecg.modules.edu` 各有一个同名 DTO，字段结构一致。

```json
{
  "ids": ["id1", "id2"]
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| ids | List\<String\> | 是 | 要删除的ID列表 |

#### CommonPageQueryDTO（common 模块通用分页查询）

```json
{
  "page": 1,
  "pageSize": 10,
  "name": "",
  "campusId": "",
  "buildingId": "",
  "floorId": "",
  "roomId": "",
  "sort": 1,
  "order": "asc"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | Integer | 是 | 当前页码 |
| pageSize | Integer | 是 | 每页大小 |
| name | String | 否 | 名称（模糊搜索） |
| campusId | String | 否 | 校区ID筛选 |
| buildingId | String | 否 | 楼栋ID筛选 |
| floorId | String | 否 | 楼层ID筛选 |
| roomId | String | 否 | 教室ID筛选 |
| sort | Integer | 否 | 排序字段 |
| order | String | 否 | 排序方向 |

#### CommonQueryPageDTO（edu 模块通用分页查询）

```json
{
  "page": 1,
  "pageSize": 10,
  "name": "",
  "campusId": "",
  "buildingId": "",
  "floorId": "",
  "roomId": "",
  "id": ""
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | Integer | 是 | 当前页码 |
| pageSize | Integer | 是 | 每页大小 |
| name | String | 否 | 名称搜索 |
| campusId | String | 否 | 校区ID |
| buildingId | String | 否 | 楼栋ID |
| floorId | String | 否 | 楼层ID |
| roomId | String | 否 | 教室ID |
| id | String | 否 | 指定ID |

---

## 一、Common 模块接口

---

### 1. 校区管理 `/common/campus`

#### 1.1 添加校区

- **URL**: `POST /common/campus/add`
- **请求体**: `CampusCommonEditDTO`

```json
{
  "name": "东校区",
  "campusCode": "EAST_001",
  "lon": 114.123456,
  "lat": 30.654321
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | String | 是 | 校区名称 |
| campusCode | String | 否 | 校区编码 |
| lon | BigDecimal | 否 | 经度 |
| lat | BigDecimal | 否 | 纬度 |

- **响应**: `Result<String>`

#### 1.2 更新校区

- **URL**: `PUT /common/campus/update`
- **请求体**: `CampusCommonEditDTO`

```json
{
  "id": "校区ID",
  "name": "东校区（更新）",
  "campusCode": "EAST_001",
  "lon": 114.123456,
  "lat": 30.654321
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | String | 是 | 校区ID |
| name | String | 否 | 校区名称 |
| campusCode | String | 否 | 校区编码 |
| lon | BigDecimal | 否 | 经度 |
| lat | BigDecimal | 否 | 纬度 |

- **响应**: `Result<String>`

#### 1.3 删除校区

- **URL**: `DELETE /common/campus/delete`
- **请求体**: `CommonDeleteIdsDTO`
- **响应**: `Result<String>`

#### 1.4 分页查询校区列表

- **URL**: `POST /common/campus/page`
- **请求体**: `CommonPageQueryDTO`
- **响应**: `Result<IPage<CommonCampusDO>>`

**CommonCampusDO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 校区ID |
| name | String | 校区名称 |
| campusCode | String | 校区编码 |
| lon | BigDecimal | 经度 |
| lat | BigDecimal | 纬度 |
| createTime | LocalDateTime | 创建时间 |
| updateTime | LocalDateTime | 更新时间 |

#### 1.5 查询校区-楼栋-楼层树形结构

- **URL**: `GET /jeecgboot/common/campus/tree`
- **请求参数**: 无
- **响应**: `Result<List<CampusBuildingFloorTreeVO>>`

**CampusBuildingFloorTreeVO 响应字段**:

```json
[
  {
    "id": "校区ID",
    "name": "校区名称",
    "campusCode": "校区编码",
    "buildings": [
      {
        "id": "楼栋ID",
        "name": "楼栋名称",
        "buildingCode": "楼栋编码",
        "floors": [
          {
            "id": "楼层ID",
            "name": "楼层名称",
            "floorCode": "楼层编码",
            "rooms": [
              {
                "id": "教室ID",
                "name": "教室名称",
                "roomCode": "教室编号"
              }
            ]
          }
        ]
      }
    ]
  }
]
```

---

### 2. 教学楼管理 `/common/building`

#### 2.1 添加教学楼

- **URL**: `POST /common/building/add`
- **请求体**: `BuildingCommonEditDTO`

```json
{
  "name": "教学楼A",
  "sort": 1,
  "buildingCode": "BLD_A",
  "campusId": "校区ID",
  "departId": "院系ID",
  "lon": 114.123,
  "lat": 30.654
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | String | 是 | 楼栋名称 |
| sort | Integer | 否 | 排序（越大越靠前） |
| buildingCode | String | 否 | 大楼编号 |
| campusId | String | 是 | 所属校区ID |
| departId | String | 否 | 所属院系ID |
| lon | BigDecimal | 否 | 经度 |
| lat | BigDecimal | 否 | 纬度 |

- **响应**: `Result<String>`

#### 2.2 更新教学楼

- **URL**: `PUT /common/building/update`
- **请求体**: `BuildingCommonEditDTO`（含 `id` 字段）
- **响应**: `Result<String>`

#### 2.3 删除教学楼

- **URL**: `DELETE /common/building/delete`
- **请求体**: `CommonDeleteIdsDTO`
- **响应**: `Result<String>`

#### 2.4 分页查询教学楼列表

- **URL**: `POST /common/building/page`
- **请求体**: `CommonPageQueryDTO`
- **响应**: `Result<IPage<BuildingPageVO>>`

**BuildingPageVO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 楼栋ID |
| name | String | 楼栋名称 |
| delFlag | Integer | 0-未删除 1-已删除 |
| sort | Integer | 排序 |
| buildingCode | String | 大楼编号 |
| campusId | String | 校区ID |
| departId | Integer | 院系ID |
| lon | BigDecimal | 经度 |
| lat | BigDecimal | 纬度 |
| campusName | String | 校区名称 |
| createTime | LocalDateTime | 创建时间 |
| updateTime | LocalDateTime | 更新时间 |

#### 2.5 查询所有楼栋列表

- **URL**: `GET /common/building/list`
- **请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| campusId | String | 否 | 校区ID |

- **响应**: `Result<List<BuildingListVO>>`

**BuildingListVO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 楼栋ID |
| name | String | 楼栋名称 |

---

### 3. 楼层管理 `/common/floor`

#### 3.1 添加楼层

- **URL**: `POST /common/floor/add`
- **请求体**: `FloorCommonEditDTO`

```json
{
  "name": "1楼",
  "buildingId": "楼栋ID",
  "sort": 1,
  "floorCode": "F1"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | String | 是 | 楼层名称 |
| buildingId | String | 是 | 所属楼栋ID |
| delFlag | Integer | 否 | 0-未删除 1-已删除 |
| sort | Integer | 否 | 排序（越大越靠前） |
| floorCode | String | 否 | 楼层编号 |

- **响应**: `Result<String>`

#### 3.2 更新楼层

- **URL**: `PUT /common/floor/update`
- **请求体**: `FloorCommonEditDTO`（含 `id` 字段）
- **响应**: `Result<String>`

#### 3.3 删除楼层

- **URL**: `DELETE /common/floor/delete`
- **请求体**: `CommonDeleteIdsDTO`
- **响应**: `Result<String>`

#### 3.4 分页查询楼层列表

- **URL**: `POST /common/floor/page`
- **请求体**: `CommonPageQueryDTO`
- **响应**: `Result<IPage<FloorPageVO>>`

**FloorPageVO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 楼层ID |
| name | String | 楼层名称 |
| buildingId | String | 楼栋ID |
| delFlag | Integer | 删除标识 |
| sort | Integer | 排序 |
| floorCode | String | 楼层编号 |
| createTime | LocalDateTime | 创建时间 |
| updateTime | LocalDateTime | 更新时间 |
| buildingName | String | 楼栋名称 |
| campusName | String | 校区名称 |

#### 3.5 查询所有楼层列表

- **URL**: `GET /common/floor/list`
- **请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| buildingId | String | 否 | 楼栋ID |

- **响应**: `Result<List<FloorListVO>>`

**FloorListVO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 楼层ID |
| name | String | 楼层名称 |

---

### 4. 教室管理 `/common/room`

#### 4.1 添加教室

- **URL**: `POST /common/room/add`
- **请求体**: `RoomCommonEditDTO`

```json
{
  "name": "101教室",
  "roomCode": "R101",
  "campusId": "校区ID",
  "buildingId": "楼栋ID",
  "floorId": "楼层ID",
  "streamId": 1,
  "roomType": 1,
  "seatNum": 60,
  "examSeatNum": 40,
  "stopTaskState": 0,
  "regionId": "",
  "regionName": ""
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | String | 是 | 教室名称 |
| roomCode | String | 否 | 教室编号 |
| campusId | String | 是 | 校区ID |
| buildingId | String | 是 | 楼栋ID |
| floorId | String | 是 | 楼层ID |
| streamId | Integer | 否 | 流媒体ID |
| roomType | Integer | 否 | 教室类型 |
| seatNum | Integer | 否 | 座位数 |
| examSeatNum | Integer | 否 | 考试座位数 |
| stopTaskState | Integer | 否 | 0-运行当日任务 1-停止当日任务 |
| regionId | String | 否 | 区域ID |
| regionName | String | 否 | 区域名称 |

- **响应**: `Result<String>`

#### 4.2 更新教室

- **URL**: `PUT /common/room/update`
- **请求体**: `RoomCommonEditDTO`（含 `id` 字段）
- **响应**: `Result<String>`

#### 4.3 删除教室

- **URL**: `DELETE /common/room/delete`
- **请求体**: `CommonDeleteIdsDTO`
- **响应**: `Result<String>`

#### 4.4 分页查询教室列表

- **URL**: `POST /common/room/page`
- **请求体**: `CommonPageQueryDTO`
- **响应**: `Result<IPage<RoomPageVO>>`

**RoomPageVO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 教室ID |
| streamId | Integer | 流媒体ID |
| roomType | Integer | 教室类型 |
| name | String | 教室名称 |
| roomCode | String | 教室编号 |
| campusId | String | 校区ID |
| floorId | String | 楼层ID |
| buildingId | String | 楼栋ID |
| stopTaskState | Integer | 0-运行当日任务 1-停止当日任务 |
| isDelete | Integer | 0-未删除 1-已删除 |
| seatNum | Integer | 座位数 |
| examSeatNum | Integer | 考试座位数 |
| regionId | String | 区域ID |
| regionName | String | 区域名称 |
| createTime | LocalDateTime | 创建时间 |
| updateTime | LocalDateTime | 更新时间 |
| campusName | String | 校区名称 |
| floorName | String | 楼层名称 |
| buildingName | String | 楼栋名称 |

#### 4.5 查询教室列表（无分页）

- **URL**: `GET /common/room/list`
- **请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| buildingId | String | 否 | 楼栋ID |
| floorId | String | 否 | 楼层ID |

- **响应**: `Result<List<RoomListVO>>`

**RoomListVO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 教室ID |
| name | String | 教室名称 |

#### 4.6 分页查询教室面板

- **URL**: `POST /common/room/search`
- **请求体**: `RoomSearchDTO`

```json
{
  "buildingId": "楼栋ID",
  "floorId": "楼层ID",
  "classRoom": "教室名关键词",
  "status": 1,
  "isFault": 2,
  "page": 1,
  "pageSize": 10
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| buildingId | String | 否 | 楼栋ID |
| floorId | String | 否 | 楼层ID |
| classRoom | String | 否 | 教室名关键词 |
| status | Integer | 否 | 1-上课 2-空闲 3-离线 4-自习 5-考试|
| isFault | Integer | 否 | 1-是故障 2-否 3-异常|
| page | Integer | 是 | 页码 |
| pageSize | Integer | 是 | 每页大小 |

- **响应**: `Result<IPage<RoomSearchVO>>`

**RoomSearchVO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| roomId | String | 教室ID |
| classRoom | String | 教室名 |
| status | Integer | 1-上课 2-下课 3-离线 |
| isFault | Integer | 1-故障 2-正常 |
| teacherName | String | 教师名 |
| courseName | String | 课程名 |
| environmentalInfo | Map\<String, String\> | 环境信息（键值对） |
| joinnumStatusModelList | List\<JoinnumStatusModel\> | 控制码状态列表 |

#### 4.7 数据大屏

- **URL**: `GET /common/room/bigScreen`
- **请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| campusId | String | 否 | 校区ID |

- **响应**: `Result<BigscreenVO>`

**BigscreenVO 响应字段**:

```json
{
  "classRoomCount": {
    "regularClassroomCount": 50,
    "smartClassroomCount": 30
  },
  "classUse": [
    {
      "campus": "东校区",
      "building": "教学楼A",
      "campusId": "",
      "buildingId": "",
      "classroomCount": 20,
      "usedCount": 15,
      "idleCount": 5
    }
  ],
  "classUseTime": {
    "useTimeMax": 480,
    "useTimeMin": 60
  },
  "latestWorkOrderRecord": [
    {
      "workOrderId": "",
      "description": "投影仪故障",
      "createTime": "2026-01-15T10:00:00"
    }
  ],
  "classRoomStatus": {
    "progressCount": 30,
    "idleCount": 40,
    "faultCount": 5,
    "offlineCount": 5
  },
  "equipmentCount": { "投影仪": 50, "空调": 80 },
  "equipmentStatus": {
    "equipmentName": "投影仪",
    "onlineCount": 45,
    "idleCount": 5
  }
}
```

---

### 5. 摄像头管理 `/common/camera`

#### 5.1 添加摄像头

- **URL**: `POST /common/camera/add`
- **请求体**: `CameraCommonEditDTO`

```json
{
  "title": "摄像头名称",
  "roomId": "教室ID",
  "group": 1,
  "type": 1,
  "rtspUrl": "rtsp://...",
  "inputLiveUrl": "",
  "inputCameraUrl": "",
  "inputSupervisorUrl": "",
  "streamType": 0,
  "recordingStatus": 0,
  "proportion": "16:9",
  "enable": 1,
  "gbNamespace": "",
  "gbChannelId": ""
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | String | 是 | 摄像头名称 |
| roomId | String | 是 | 教室ID |
| group | Integer | 否 | 分组 |
| type | Integer | 否 | 类型 |
| rtspUrl | String | 否 | RTSP地址 |
| inputLiveUrl | String | 否 | 直播输入地址 |
| inputCameraUrl | String | 否 | 监控输入地址 |
| inputSupervisorUrl | String | 否 | 督导输入地址 |
| streamType | Integer | 否 | 0-h264 1-h265 2-m3u8 |
| recordingStatus | Integer | 否 | 录制状态 |
| proportion | String | 否 | 画面比例 |
| enable | Integer | 否 | 是否启用 |
| gbNamespace | String | 否 | 国标命名空间 |
| gbChannelId | String | 否 | 国标通道ID |

- **响应**: `Result<String>`

#### 5.2 更新摄像头

- **URL**: `PUT /common/camera/update`
- **请求体**: `CameraCommonEditDTO`（含 `id` 字段）
- **响应**: `Result<String>`

#### 5.3 删除摄像头

- **URL**: `DELETE /common/camera/delete`
- **请求体**: `CommonDeleteIdsDTO`
- **响应**: `Result<String>`

#### 5.4 分页查询摄像头列表

- **URL**: `POST /common/camera/list`
- **请求体**: `CommonPageQueryDTO`
- **响应**: `Result<IPage<CameraPageVO>>`

**CameraPageVO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 摄像头ID |
| title | String | 摄像头名称 |
| roomName | String | 教室名称 |
| streamId | Integer | 流媒体ID |
| group | Integer | 分组 |
| type | Integer | 类型 |
| rtspUrl | String | RTSP地址 |
| inputLiveUrl | String | 直播输入地址 |
| inputCameraUrl | String | 监控输入地址 |
| inputSupervisorUrl | String | 督导输入地址 |
| streamType | Integer | 流类型 |
| monitorUrl | String | 监控播放地址 |
| liveUrl | String | 直播播放地址 |
| supervisorUrl | String | 督导播放地址 |
| recordingStatus | Integer | 录制状态 |
| proportion | String | 画面比例 |
| enable | Integer | 是否启用 |
| gbNamespace | String | 国标命名空间 |
| gbChannelId | String | 国标通道ID |

#### 5.5 开始拉流

- **URL**: `POST /common/camera/start`
- **请求体**: `List<CameraStartDTO>`

```json
[
  {
    "id": "摄像头ID",
    "title": "",
    "roomId": "",
    "streamId": 1,
    "group": 1,
    "type": 1,
    "rtspUrl": "rtsp://...",
    "inputLiveUrl": "",
    "inputCameraUrl": "",
    "inputSupervisorUrl": "",
    "streamType": 0,
    "recordingStatus": 0,
    "proportion": "16:9"
  }
]
```

- **响应**: `Result<String>`（成功/失败）

#### 5.6 获取摄像头播放地址

- **URL**: `POST /common/camera/windows`
- **请求体**: `CameraWindowsDTO`

```json
{
  "roomId": "教室ID",
  "type": 1
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| roomId | String | 是 | 教室ID |
| type | Integer | 否 | 类型 |

- **响应**: `Result<List<CommonStreamOutputVO>>`

**CommonStreamOutputVO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| type | Integer | 类型 |
| title | String | 标题 |
| id | String | ID |
| sourceId | String | 源ID |
| format | String | 格式 |
| outputType | Integer | 输出类型 |
| url | String | 播放地址 |
| bitrateKbps | Integer | 码率(kbps) |
| width | Integer | 宽度 |
| height | Integer | 高度 |
| fps | Integer | 帧率 |
| enable | Integer | 是否启用 |
| createdAt | LocalDateTime | 创建时间 |
| updatedAt | LocalDateTime | 更新时间 |

#### 5.7 同步地址

- **URL**: `POST /common/camera/address`
- **请求参数**: 无
- **响应**: `Result<String>`（成功/失败）

---

### 6. 学期管理 `/common/semester`

#### 6.1 添加学期

- **URL**: `POST /common/semester/add`
- **请求体**: `SemesterCommonEditDTO`

```json
{
  "semesterName": "2025-2026学年第一学期",
  "startTime": "2025-09-01",
  "endTime": "2026-01-15",
  "academyYear": "2025-2026",
  "semester": "1"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| semesterName | String | 是 | 学期名称 |
| startTime | LocalDate | 是 | 开始日期 (yyyy-MM-dd) |
| endTime | LocalDate | 是 | 结束日期 (yyyy-MM-dd) |
| academyYear | String | 否 | 学年 |
| semester | String | 否 | 学期 |

- **响应**: `Result<String>`

#### 6.2 更新学期

- **URL**: `PUT /common/semester/update`
- **请求体**: `SemesterCommonEditDTO`（含 `id` 字段）
- **响应**: `Result<String>`

#### 6.3 删除学期

- **URL**: `DELETE /common/semester/delete`
- **请求体**: `CommonDeleteIdsDTO`
- **响应**: `Result<String>`

#### 6.4 分页查询学期列表

- **URL**: `POST /common/semester/list`
- **请求体**: `CommonPageQueryDTO`
- **响应**: `Result<IPage<CommonSemesterDO>>`

**CommonSemesterDO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 学期ID |
| semesterName | String | 学期名称 |
| startTime | LocalDate | 开始日期 |
| endTime | LocalDate | 结束日期 |
| totalWeek | Integer | 总周数 |
| academyYear | String | 学年 |
| semester | String | 学期 |
| createTime | LocalDateTime | 创建时间 |
| updateTime | LocalDateTime | 更新时间 |

---

### 7. 课节管理 `/common/lesson`

#### 7.1 添加课节

- **URL**: `POST /common/lesson/add`
- **请求体**: `LessonCommonEditDTO`

```json
{
  "startTime": "08:00:00",
  "endTime": "08:45:00",
  "startOffset": 10,
  "endOffset": 5
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| startTime | LocalTime | 是 | 开始时间 (HH:mm:ss) |
| endTime | LocalTime | 是 | 结束时间 (HH:mm:ss) |
| startOffset | Integer | 否 | 开始偏移（分钟） |
| endOffset | Integer | 否 | 结束偏移（分钟） |

- **响应**: `Result<String>`

#### 7.2 更新课节

- **URL**: `PUT /common/lesson/update`
- **请求体**: `LessonCommonEditDTO`（含 `id` 字段）
- **响应**: `Result<String>`

#### 7.3 删除课节

- **URL**: `DELETE /common/lesson/delete`
- **请求体**: `CommonDeleteIdsDTO`
- **响应**: `Result<String>`

#### 7.4 分页查询课节列表

- **URL**: `POST /common/lesson/list`
- **请求体**: `CommonPageQueryDTO`
- **响应**: `Result<IPage<LessonPageVO>>`

**LessonPageVO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 课节ID |
| startTime | LocalTime | 开始时间 |
| endTime | LocalTime | 结束时间 |
| startOffset | Integer | 开始偏移 |
| endOffset | Integer | 结束偏移 |
| timing | Integer | 时长 |
| realStartTime | LocalTime | 实际开始时间 |
| realEndTime | LocalTime | 实际结束时间 |

---

### 8. 配置管理 `/common/config`

#### 8.1 添加配置

- **URL**: `POST /common/config/add`
- **请求体**: `ConfigCommonEditDTO`

```json
{
  "type": "system",
  "key": "config_key",
  "value": "config_value",
  "desc": "配置描述"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | String | 是 | 配置类型 |
| key | String | 是 | 配置键 |
| value | String | 是 | 配置值 |
| desc | String | 否 | 描述 |

- **响应**: `Result<String>`

#### 8.2 更新配置

- **URL**: `PUT /common/config/update`
- **请求体**: `ConfigCommonEditDTO`（含 `id` 字段）
- **响应**: `Result<String>`

#### 8.3 删除配置

- **URL**: `DELETE /common/config/delete`
- **请求体**: `CommonDeleteIdsDTO`
- **响应**: `Result<String>`

#### 8.4 分页查询配置列表

- **URL**: `POST /common/config/list`
- **请求体**: `CommonPageQueryDTO`
- **响应**: `Result<IPage<CommonConfigDO>>`

**CommonConfigDO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 配置ID |
| key | String | 配置键 |
| desc | String | 描述 |
| type | String | 配置类型 |
| value | String | 配置值 |
| createTime | LocalDateTime | 创建时间 |
| updateTime | LocalDateTime | 更新时间 |

#### 8.5 查询配置类型列表

- **URL**: `POST /common/config/type`
- **请求参数**: 无
- **响应**: `Result<List<String>>`（返回所有配置类型字符串列表）

---

### 9. 课表管理 `/common/timetable`

#### 9.1 查询课表列表

- **URL**: `POST /common/timetable/list`
- **请求体**: `TimetableDTO`

```json
{
  "semesterId": "学期ID",
  "week": "1",
  "roomId": "教室ID",
  "weekday": 1
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| semesterId | String | 否 | 学期ID |
| week | String | 否 | 第几周 |
| roomId | String | 否 | 教室ID |
| weekday | Integer | 否 | 星期几 |

- **响应**: `Result<List<TimetableDO>>`

**TimetableDO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 课表ID |
| semesterId | String | 学期ID |
| week | String | 第几周 |
| weekday | String | 星期几 |
| lessons | String | 第几节 |
| roomId | String | 教室ID |
| roomName | String | 教室名 |
| teacherId | String | 教师ID |
| jobNumber | String | 教师工号 |
| teacherName | String | 教师名 |
| teacherAcademyId | String | 教师院系ID |
| courseId | String | 课程ID |
| courseName | String | 课程名 |
| wid | String | 连堂课标识 |
| className | String | 班级名 |
| classAcademyId | String | 班级院系ID |
| reserveId | String | 扩展字段 |
| attendNum | Integer | 应到人数 |
| type | Integer | 1-课表自动 2-手动创建 |
| isDelete | Integer | 1-已删除 |
| createTime | Date | 创建时间 |
| updateTime | Date | 更新时间 |

#### 9.2 查询上课状态

- **URL**: `POST /common/timetable/num`
- **请求体**: `TimetableDTO`
- **响应**: `Result<TimetableClassNumVO>`

**TimetableClassNumVO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| all | Integer | 全部课程数 |
| will | Integer | 将要上课 |
| over | Integer | 已下课 |
| ing | Integer | 正在上课 |

#### 9.3 获取当前学期信息

- **URL**: `GET /common/timetable/now`
- **请求参数**: 无
- **响应**: `Result<WeekInfo>`

---

### 10. 换课管理 `/common/exchange`

#### 10.1 换课计划

- **URL**: `POST /common/exchange/plan`
- **请求体**: `TimetableExchangePlanDTO`

```json
{
  "type": "exchange",
  "name": "换课说明",
  "originalRoomId": "原教室ID",
  "targetRoomId": "目标教室ID",
  "semesterId": "学期ID",
  "originalWeek": 5,
  "originalWeekday": 1,
  "originalLessons": [1, 2],
  "targetWeek": 5,
  "targetWeekday": 3,
  "targetLessons": [3, 4]
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | String | 是 | 换课类型 |
| name | String | 否 | 说明 |
| originalRoomId | String | 是 | 原教室ID |
| targetRoomId | String | 是 | 目标教室ID |
| semesterId | String | 是 | 学期ID |
| originalWeek | Integer | 是 | 原来第几周 |
| originalWeekday | Integer | 是 | 原来星期几 |
| originalLessons | List\<Integer\> | 是 | 原来第几节课 |
| targetWeek | Integer | 是 | 目标第几周 |
| targetWeekday | Integer | 是 | 目标星期几 |
| targetLessons | List\<Integer\> | 是 | 目标第几节课 |

- **响应**: `Result<String>`（交换成功/交换失败）

---

### 11. 操作记录管理 `/operationLog`

#### 11.1 分页查询操作记录

- **URL**: `POST /operationLog/page`
- **请求体**: `OperationLogPageDTO`

```json
{
  "page": 1,
  "pageSize": 10,
  "actionType": 1
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | Integer | 是 | 页码 |
| pageSize | Integer | 是 | 每页大小 |
| actionType | Integer | 否 | 操作类型：1-手动控制 2-课表自动控制 3-定时任务(手动) 4-定时任务(自动) 5-状态上报 6-升级程序 |

- **响应**: `Result<IPage<OperationLogDO>>`

**OperationLogDO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 记录ID |
| userId | String | 用户ID |
| actionType | Integer | 操作类型 |
| content | String | 内容 |
| ip | String | IP地址 |
| joinnumId | String | 设备ID |
| roomId | String | 教室ID |
| roomName | String | 教室名称 |
| clientType | String | 客户端类型(pc/app/h5/server) |
| createTime | Date | 创建时间 |
| updateTime | Date | 更新时间 |

#### 11.2 教室使用时长排名

- **URL**: `POST /operationLog/room/useTime`
- **请求体**: `ReportRoomUseTimePageDTO`

```json
{
  "sort": 2,
  "year": 2026,
  "month": 3,
  "season": "spring",
  "startTime": "2026-01-01",
  "endTime": "2026-03-31"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| sort | Integer | 否 | 1-最少(升序Top10) 2-最多(降序Top10) |
| year | Integer | 否 | 年份 |
| month | Integer | 否 | 月份 |
| season | String | 否 | 季节 |
| startTime | Date | 否 | 开始时间 |
| endTime | Date | 否 | 结束时间 |

- **响应**: `Result<List<ReportRoomUseTimeVO>>`

**ReportRoomUseTimeVO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| roomName | String | 教室名称 |
| time | Integer | 使用时长 |

---

### 12. 一卡通管理 `/iccard`

#### 12.1 分页查询一卡通列表

- **URL**: `POST /iccard/page`
- **请求体**: `CardPageDTO`

```json
{
  "page": 1,
  "size": 10,
  "name": "张三",
  "cardNo": 12345678
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | Integer | 是 | 页码 |
| size | Integer | 是 | 每页大小 |
| name | String | 否 | 姓名 |
| cardNo | Long | 否 | 卡号 |

- **响应**: `Result<IPage<CardPageVO>>`

**CardPageVO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Integer | ID |
| cardNo | String | 卡号 |
| name | String | 姓名 |
| status | String | 状态 |

---

## 二、Edu 模块接口

---

### 1. 学生管理 `/edu/student`

#### 1.1 添加学生

- **URL**: `POST /edu/student/add`
- **请求体**: `Student`

```json
{
  "studentNo": "20260001",
  "name": "张三",
  "gender": "男",
  "birthday": "2000-01-15",
  "phone": "13800138000",
  "email": "zhangsan@example.com",
  "idCard": "420000200001150011",
  "address": "湖北省武汉市",
  "hukou": "湖北武汉",
  "familyDifficulty": "否",
  "specialTalent": "篮球",
  "talentLevel": "国家二级"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| studentNo | String | 是 | 学号 |
| name | String | 是 | 姓名 |
| gender | String | 否 | 性别 |
| birthday | Date | 否 | 出生日期 |
| phone | String | 否 | 手机号 |
| email | String | 否 | 邮箱 |
| idCard | String | 否 | 身份证号 |
| address | String | 否 | 地址 |
| hukou | String | 否 | 户籍（某些学校必填） |
| familyDifficulty | String | 否 | 家庭困难情况 |
| specialTalent | String | 否 | 特长（某些学校必填） |
| talentLevel | String | 否 | 特长等级（某些学校必填） |

- **响应**: `Result<String>`

#### 1.2 更新学生

- **URL**: `PUT /edu/student/update`
- **请求体**: `Student`（含 `id` 字段）
- **响应**: `Result<String>`

#### 1.3 删除学生

- **URL**: `DELETE /edu/student/delete`
- **请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | String | 是 | 学生ID |

- **响应**: `Result<String>`

#### 1.4 查询学生详情

- **URL**: `GET /edu/student/detail`
- **请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | String | 是 | 学生ID |

- **响应**: `Result<Student>`

**Student 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 学生ID |
| studentNo | String | 学号 |
| name | String | 姓名 |
| gender | String | 性别 |
| birthday | Date | 出生日期 |
| phone | String | 手机号 |
| email | String | 邮箱 |
| idCard | String | 身份证号 |
| address | String | 地址 |
| hukou | String | 户籍 |
| familyDifficulty | String | 家庭困难情况 |
| specialTalent | String | 特长 |
| talentLevel | String | 特长等级 |
| createBy | String | 创建人 |
| createTime | Date | 创建时间 |
| updateBy | String | 更新人 |
| updateTime | Date | 更新时间 |
| delFlag | Integer | 删除标记 |

#### 1.5 分页查询学生列表

- **URL**: `GET /edu/student/list`
- **请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| pageNo | Integer | 否 | 当前页码，默认1 |
| pageSize | Integer | 否 | 每页大小，默认10 |
| name | String | 否 | 姓名（模糊查询） |
| studentNo | String | 否 | 学号（精确查询） |

- **响应**: `Result<IPage<Student>>`

---

### 2. 控制码管理 `/edu/joinnum`

#### 2.1 分配控制码

- **URL**: `POST /edu/joinnum/add`
- **请求体**: `JoinnumEditDTO`

```json
{
  "campusIds": ["校区ID1"],
  "buildingIds": ["楼栋ID1"],
  "floorIds": ["楼层ID1"],
  "roomIds": ["教室ID1", "教室ID2"],
  "labelIds": ["标签ID1"]
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| campusIds | List\<String\> | 否 | 校区ID列表 |
| buildingIds | List\<String\> | 否 | 楼栋ID列表 |
| floorIds | List\<String\> | 否 | 楼层ID列表 |
| roomIds | List\<String\> | 否 | 教室ID列表 |
| labelIds | List\<String\> | 否 | 标签ID列表 |

- **响应**: `Result<String>`（成功分配N个控制码）

#### 2.2 控制多个教室上下课

- **URL**: `POST /edu/joinnum/remote/controls`
- **请求体**: `CMDDatasDTO`

```json
{
  "roomIds": ["教室ID1", "教室ID2"],
  "value": 1
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| roomIds | List\<String\> | 是 | 教室ID列表 |
| value | Integer | 是 | 控制值 |

- **响应**: `Result<String>`

#### 2.3 单选教室远程控制

- **URL**: `POST /edu/joinnum/remote/controldevice`
- **请求体**: `JoinnumControDatasDTO`

```json
{
  "roomId": "教室ID",
  "joinNumId": "控制码ID",
  "value": 1
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| roomId | String | 是 | 教室ID |
| joinNumId | String | 是 | 控制码ID |
| value | Integer | 是 | 控制值 |

- **响应**: `Result<String>`

#### 2.4 多选教室远程控制

- **URL**: `POST /edu/joinnum/remote/multicontroldevice`
- **请求体**: `MultiDatasDTO`

```json
{
  "roomIds": ["教室ID1", "教室ID2"],
  "joinNum": 1,
  "value": 1
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| roomIds | List\<String\> | 是 | 教室ID列表 |
| joinNum | Integer | 是 | 控制码编号 |
| value | Integer | 是 | 控制值 |

- **响应**: `Result<String>`

---

### 3. 控制码标签管理 `/edu/joinLabel`

#### 3.1 分页查询标签列表

- **URL**: `POST /edu/joinLabel/cameron`
- **请求体**: `CommonQueryPageDTO`
- **响应**: `Result<IPage<EDUJoinnumLabelVO>>`

**EDUJoinnumLabelVO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 标签ID |
| joinNum | Integer | 控制码编号 |
| equipmentType | Integer | 设备类型 |
| equipmentTypeName | String | 设备类型名称 |
| equipmentName | String | 设备名称 |
| isDelete | Integer | 删除标识 |
| showStatus | Integer | 显示状态 |
| valueType | Integer | 值类型 |
| valueTypeName | String | 值类型名称 |
| joinnumType | Integer | 控制码类型 |
| joinnumTypeName | String | 控制码类型名称 |
| buttonType | Integer | 按钮类型 |
| buttonTypeName | String | 按钮类型名称 |
| buttonStatusList | List\<String\> | 按钮状态列表 |

#### 3.2 获取设备类型列表

- **URL**: `GET /edu/joinLabel/equipment`
- **请求参数**: 无
- **响应**: `Result<List<EquipmentTypeVO>>`

| 字段 | 类型 | 说明 |
|------|------|------|
| type | Integer | 类型编号 |
| name | String | 类型名称 |

#### 3.3 获取按钮类型列表

- **URL**: `GET /edu/joinLabel/button`
- **请求参数**: 无
- **响应**: `Result<List<ButtonTypeVO>>`

| 字段 | 类型 | 说明 |
|------|------|------|
| buttonType | Integer | 按钮类型编号 |
| buttonTypeName | String | 按钮类型名称 |

#### 3.4 获取值类型列表

- **URL**: `GET /edu/joinLabel/value`
- **请求参数**: 无
- **响应**: `Result<List<ValueTypeVO>>`

| 字段 | 类型 | 说明 |
|------|------|------|
| valueType | Integer | 值类型编号 |
| valueTypeName | String | 值类型名称 |

#### 3.5 获取控制码类型列表

- **URL**: `GET /edu/joinLabel/joinnum`
- **请求参数**: 无
- **响应**: `Result<List<JoinnumTypeVO>>`

| 字段 | 类型 | 说明 |
|------|------|------|
| joinnumType | Integer | 控制码类型编号 |
| joinnumTypeName | String | 控制码类型名称 |

#### 3.6 新增标签

- **URL**: `POST /edu/joinLabel/add`
- **请求体**: `JoinnumLabelDTO`

```json
{
  "joinNum": 1,
  "equipmentType": 1,
  "equipmentName": "投影仪",
  "showStatus": 1,
  "valueType": "1",
  "joinnumType": 1,
  "buttonType": 1
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| joinNum | Integer | 是 | 控制码编号 |
| equipmentType | Integer | 是 | 设备类型 |
| equipmentName | String | 是 | 设备名称 |
| showStatus | Integer | 否 | 显示状态 |
| valueType | String | 否 | 值类型 |
| joinnumType | Integer | 否 | 控制码类型 |
| buttonType | Integer | 否 | 按钮类型 |

- **响应**: `Result<String>`

#### 3.7 编辑标签

- **URL**: `POST /edu/joinLabel/update`
- **请求体**: `JoinnumLabelDTO`（含 `id` 字段）
- **响应**: `Result<String>`

#### 3.8 删除标签

- **URL**: `POST /edu/joinLabel/del`
- **请求体**: `CommonDeleteIdsDTO`
- **响应**: `Result<String>`

---

### 4. 任务管理 `/edu/task`

#### 4.1 分页查询任务列表

- **URL**: `POST /edu/task/page`
- **请求体**: `CommonQueryPageDTO`
- **响应**: `Result<IPage<TaskVO>>`

**TaskVO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 任务ID |
| taskName | String | 任务名称 |
| taskType | String | 任务类型 |
| taskCycle | String | 任务周期 |
| description | String | 描述 |
| cronSpec | String | Cron 表达式 |
| cronConfig | String | Cron 配置 |
| concurrent | Byte | 并发 |
| arge | String | 参数 |
| status | Integer | 状态 |
| timeout | Short | 超时 |
| vulnNum | Integer | 漏洞数 |
| taskDay | Integer | 任务天数 |
| taskHour | String | 任务小时 |
| createdTime | LocalDateTime | 创建时间 |
| updatedTime | LocalDateTime | 更新时间 |
| taskTypeVOS | List\<TaskTypeVO\> | 任务类型列表 |
| roomTaskVOList | List\<RoomTaskVO\> | 教室任务列表 |
| lastActiveTime | LocalDateTime | 最后活跃时间 |

#### 4.2 立即执行任务

- **URL**: `POST /edu/task/execute`
- **请求体**: `CommonQueryPageDTO`（只需要 `id` 字段）

```json
{
  "id": "任务ID"
}
```

- **响应**: `Result<String>`

#### 4.3 激活/停用任务

- **URL**: `POST /edu/task/reactive`
- **请求体**: `TaskReactiveDTO`

```json
{
  "taskId": "任务ID",
  "status": 1
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| taskId | String | 是 | 任务ID |
| status | Integer | 是 | 状态 |

- **响应**: `Result<String>`

#### 4.4 新增/编辑任务

- **URL**: `POST /edu/task/edit`
- **请求体**: `TaskEditDTO`

```json
{
  "id": "任务ID（编辑时传，新增时不传）",
  "taskName": "定时上课",
  "taskType": "control",
  "cronSpec": "0 0 8 * * ?",
  "taskCycle": "daily",
  "description": "每天8点自动上课",
  "cronConfig": "",
  "concurrent": 0,
  "arge": "",
  "status": 1,
  "timeout": 30,
  "vulnNum": 0,
  "taskDay": 0,
  "taskHour": "08:00",
  "roomIds": ["教室ID1", "教室ID2"],
  "taskTypeDOS": []
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | String | 否 | 任务ID（编辑时必填） |
| taskName | String | 是 | 任务名称 |
| taskType | String | 是 | 任务类型 |
| cronSpec | String | 否 | Cron 表达式 |
| taskCycle | String | 否 | 任务周期 |
| description | String | 否 | 描述 |
| cronConfig | String | 否 | Cron 配置 |
| concurrent | Byte | 否 | 并发 |
| arge | String | 否 | 参数 |
| status | Integer | 否 | 状态 |
| timeout | Short | 否 | 超时(秒) |
| vulnNum | Integer | 否 | 漏洞数 |
| taskDay | Integer | 否 | 任务天数 |
| taskHour | String | 否 | 任务小时 |
| roomIds | List\<String\> | 否 | 教室ID列表 |
| taskTypeDOS | List\<Object\> | 否 | 任务类型数据 |

- **响应**: `Result<String>`

#### 4.5 删除任务

- **URL**: `POST /edu/task/del`
- **请求体**: `CommonDeleteIdsDTO`
- **响应**: `Result<String>`

#### 4.6 任务总数预览

- **URL**: `POST /edu/task/num`
- **请求参数**: 无
- **响应**: `Result<TaskDataVO>`

**TaskDataVO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| all | Integer | 全部任务数 |
| active | Integer | 已激活任务数 |
| disable | Integer | 已禁用任务数 |
| today | Integer | 今日任务数 |

---

### 5. 任务日志 `/edu/taskLog`

#### 5.1 分页查询任务日志

- **URL**: `POST /edu/taskLog/page`
- **请求体**: `CommonQueryPageDTO`
- **响应**: `Result<IPage<TaskLogDO>>`

**TaskLogDO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 日志ID |
| taskId | String | 任务ID |
| joinNum | Integer | 控制码 |
| value | String | 控制值 |
| status | Integer | 状态 |
| createTime | LocalDateTime | 创建时间 |
| updateTime | LocalDateTime | 更新时间 |

---

### 6. 资产管理 `/equipment`

#### 6.1 分页查询资产列表

- **URL**: `POST /equipment/page`
- **请求体**: `EquipmentPageDTO`

```json
{
  "name": "投影仪",
  "type": 1,
  "status": 1,
  "scrap": 0,
  "page": 1,
  "pageSize": 10
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | String | 否 | 设备名称 |
| type | Integer | 否 | 设备类型 |
| status | Integer | 否 | 状态 |
| scrap | Integer | 否 | 是否报废 |
| page | Integer | 是 | 页码 |
| pageSize | Integer | 是 | 每页大小 |

- **响应**: `Result<IPage<EquipmentPageVO>>`

**EquipmentPageVO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 设备ID |
| name | String | 设备名称 |
| brand | String | 品牌 |
| model | String | 型号 |
| group | Integer | 分组 |
| purchasingDate | String | 购买日期 |
| serviceLifeHour | Integer | 使用寿命(小时) |
| workingTime | Integer | 已工作时长 |
| type | Integer | 类型编号 |
| typeName | String | 类型名称 |
| status | Integer | 状态 |
| buildingId | String | 楼栋ID |
| floorId | String | 楼层ID |
| roomId | String | 教室ID |

#### 6.2 新增资产

- **URL**: `POST /equipment/add`
- **请求体**: `EquipmentAddDTO`

```json
{
  "buildingId": "楼栋ID",
  "floorId": "楼层ID",
  "roomId": "教室ID",
  "name": "投影仪",
  "brand": "Epson",
  "model": "CB-FH52",
  "group": 1,
  "type": 1,
  "serviceLifeHour": 20000,
  "purchasingDate": "2025-06-01"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| buildingId | String | 否 | 楼栋ID |
| floorId | String | 否 | 楼层ID |
| roomId | String | 否 | 教室ID |
| name | String | 是 | 设备名称 |
| brand | String | 否 | 品牌 |
| model | String | 否 | 型号 |
| group | Integer | 否 | 分组 |
| type | Integer | 是 | 设备类型 |
| serviceLifeHour | Integer | 否 | 使用寿命(小时) |
| purchasingDate | String | 否 | 购买日期 |

- **响应**: `Result<String>`

#### 6.3 修改资产

- **URL**: `POST /equipment/update`
- **请求体**: `EquipmentUpdateDTO`

```json
{
  "id": "设备ID",
  "buildingId": "楼栋ID",
  "floorId": "楼层ID",
  "roomId": "教室ID",
  "name": "投影仪",
  "brand": "Epson",
  "model": "CB-FH52",
  "group": 1,
  "type": 1,
  "serviceLifeHour": 20000,
  "purchasingDate": "2025-06-01",
  "status": 1
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | String | 是 | 设备ID |
| status | Integer | 否 | 状态 |
| 其余字段 | - | - | 同 EquipmentAddDTO |

- **响应**: `Result<String>`

#### 6.4 删除资产

- **URL**: `POST /equipment/del`
- **请求体**: `EquipmentDelDTO`

```json
{
  "ids": ["设备ID1", "设备ID2"]
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| ids | List\<String\> | 是 | 设备ID列表 |

- **响应**: `Result<String>`

#### 6.5 获取资产详情

- **URL**: `GET /equipment/detail/{id}`
- **路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | String | 是 | 设备ID |

- **响应**: `Result<EqueipemntDetailVO>`

**EqueipemntDetailVO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 设备ID |
| address | String | 位置 |
| name | String | 设备名称 |
| brand | String | 品牌 |
| model | String | 型号 |
| group | Integer | 分组 |
| purchasingDate | String | 购买日期 |
| serviceLifeHour | Integer | 使用寿命(小时) |
| workingTime | Integer | 已工作时长 |
| type | Integer | 类型 |
| status | String | 状态 |

#### 6.6 统计设备各状态数量

- **URL**: `GET /equipment/count`
- **请求参数**: 无
- **响应**: `Result<EquipmentStatusCountVO>`

**EquipmentStatusCountVO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| totalCount | Integer | 总数 |
| normalCount | Integer | 正常数 |
| abnormalCount | Integer | 异常数 |
| scrapCount | Integer | 即将报废数 |

#### 6.7 根据教室查询所有设备及状态

- **URL**: `GET /equipment/status`
- **请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| roomId | String | 是 | 教室ID |

- **响应**: `Result<List<EquipmentStatusVO>>`

**EquipmentStatusVO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| joinnumId | String | 控制码ID |
| name | String | 设备名称 |
| value | String | 状态值 |

---

### 7. 资产分类管理 `/equipmentTypeDO`

#### 7.1 获取资产分类列表

- **URL**: `GET /equipmentTypeDO/list`
- **请求参数**: 无
- **响应**: `Result<List<EquipmentTypeVO>>`

**EquipmentTypeVO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| type | Integer | 类型编号 |
| name | String | 类型名称 |

---

### 8. 故障报修管理 `/workOrder`

#### 8.1 故障报修分页查询

- **URL**: `POST /workOrder/page`
- **请求体**: `WorklOrderPageDTO`

```json
{
  "page": 1,
  "pageSize": 10,
  "status": 1,
  "faultType": 1,
  "buildingId": "楼栋ID",
  "floorId": "楼层ID",
  "roomId": "教室ID"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | Integer | 是 | 页码 |
| pageSize | Integer | 是 | 每页大小 |
| status | Integer | 否 | 状态 |
| faultType | Integer | 否 | 故障类型 |
| buildingId | String | 否 | 楼栋ID |
| floorId | String | 否 | 楼层ID |
| roomId | String | 否 | 教室ID |

- **响应**: `Result<IPage<WorkOrderPageVO>>`

**WorkOrderPageVO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 工单ID |
| title | String | 标题 |
| address | String | 地址 |
| faultType | String | 故障类型 |
| description | String | 描述 |
| createUser | String | 创建人 |
| createTime | Date | 创建时间 |
| status | String | 状态 |

#### 8.2 新增故障报修

- **URL**: `POST /workOrder/add`
- **请求体**: `WorkOrderAddDTO`

```json
{
  "equipmentId": "设备ID",
  "buildingId": "楼栋ID",
  "floorId": "楼层ID",
  "roomId": "教室ID",
  "title": "投影仪故障",
  "faultType": 1,
  "description": "投影仪无法开机",
  "status": 1
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| equipmentId | String | 是 | 设备ID |
| buildingId | String | 否 | 楼栋ID |
| floorId | String | 否 | 楼层ID |
| roomId | String | 否 | 教室ID |
| title | String | 是 | 故障标题 |
| faultType | Integer | 是 | 故障类型 |
| description | String | 否 | 故障描述 |
| status | Integer | 否 | 状态 |

- **响应**: `Result<String>`

#### 8.3 编辑故障报修

- **URL**: `POST /workOrder/update`
- **请求体**: `WorkOrderUpdateDTO`

```json
{
  "id": "工单ID",
  "equipmentId": "设备ID",
  "buildingId": 1,
  "floorId": 1,
  "roomId": 1,
  "title": "投影仪故障",
  "faultType": 1,
  "description": "投影仪无法开机",
  "status": 2
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | String | 是 | 工单ID |
| equipmentId | String | 否 | 设备ID |
| buildingId | Integer | 否 | 楼栋ID |
| floorId | Integer | 否 | 楼层ID |
| roomId | Integer | 否 | 教室ID |
| title | String | 否 | 故障标题 |
| faultType | Integer | 否 | 故障类型 |
| description | String | 否 | 故障描述 |
| status | Integer | 否 | 状态 |

- **响应**: `Result<String>`

#### 8.4 撤销故障报修

- **URL**: `POST /workOrder/del`
- **请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| orderId | String | 是 | 工单ID |

- **响应**: `Result<String>`

#### 8.5 查看处理进度

- **URL**: `GET /workOrder/progress`
- **请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| orderId | String | 是 | 工单ID |

- **响应**: `Result<List<WorkOrderProgressVO>>`

**WorkOrderProgressVO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| createTime | Date | 时间 |
| title | String | 标题 |
| content | String | 内容 |

#### 8.6 提交工单处理流程

- **URL**: `POST /workOrder/submitProgress`
- **请求体**: `WorkOrderSubmitProgressDTO`

```json
{
  "workId": "工单ID",
  "equipmentId": "设备ID",
  "status": 2,
  "handleDetail": "已更换灯泡"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| workId | String | 是 | 工单ID |
| equipmentId | String | 否 | 设备ID |
| status | Integer | 是 | 处理状态 '0-未处理；1-延后处理；2-已解决；3-不需要处理' |
| handleDetail | String | 否 | 处理详情 |

- **响应**: `Result<String>`

---

### 9. 巡检记录管理 `/patrolDetail`

#### 9.1 进行巡检

- **URL**: `POST /patrolDetail/check`
- **请求体**: `AICheckDTO`

```json
{
  "roomIds": ["教室ID1", "教室ID2"]
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| roomIds | List\<String\> | 是 | 教室ID列表 |

- **响应**: `Result<String>`

#### 9.2 巡检分页查询

- **URL**: `POST /patrolDetail/record`
- **请求体**: `PatrolDetailDTO`

```json
{
  "page": 1,
  "pageSize": 10,
  "createTime": "2026-03-01"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | Integer | 是 | 页码 |
| pageSize | Integer | 是 | 每页大小 |
| createTime | Date | 否 | 创建时间筛选 |

- **响应**: `Result<PatrolRecordPageResultVO>`

**PatrolRecordPageResultVO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| pageData | IPage\<PatrolDetailPageVO\> | 分页数据 |
| abnormalCount | Integer | 异常总数 |
| latestPatrolTime | Date | 最近巡检时间 |
| totalRoomCount | Integer | 教室总数 |

**PatrolDetailPageVO 字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 巡检记录ID |
| createTime | Date | 创建时间 |
| campus | String | 校区 |
| building | String | 楼栋 |
| floor | String | 楼层 |
| room | String | 教室 |
| status | Integer | 状态 |
| imgUrl1 | String | 图片地址 |
| deviceCount | Integer | 设备数量 |

#### 9.3 单次巡检详情

- **URL**: `GET /patrolDetail/detail`
- **请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| patrolId | String | 是 | 巡检记录ID |

- **响应**: `Result<PatrolDetailVO>`

**PatrolDetailVO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| campus | String | 校区 |
| building | String | 楼栋 |
| floor | String | 楼层 |
| room | String | 教室 |
| createTime | Date | 巡检时间 |
| status | Integer | 状态 |
| imgUrls | List\<String\> | 截图列表 |
| equipmentStatus | Map\<String, Integer\> | 设备状态(设备名-状态值) |

#### 9.4 巡检回调（内部接口）

- **URL**: `POST /patrolDetail/result`
- **请求体**: `AICheckResultDTO`

```json
{
  "states": [
    {
      "name": "教室名",
      "type": 1,
      "dateTime": 1700000000,
      "img": "图片URL"
    }
  ]
}
```

- **响应**: `Result<String>`

#### 9.5 巡检日历

- **URL**: `POST /patrolDetail/calendar`
- **请求体**: `PatrolCalendarDTO`

```json
{
  "queryDate": "2026-03-13 00:00:00"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| queryDate | Date | 是 | 查询日期（往前一个月） |

- **响应**: `Result<List<PatrolCalendarVO>>`

**PatrolCalendarVO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| date | String | 日期 |
| patrolCount | Integer | 巡检次数 |
| failCount | Integer | 异常次数 |
| status | Integer | 巡检状态 | 1为正常 2为异常 3为未巡检

---

### 10. 刷卡记录管理 `/payCardLog`

#### 10.1 分页查询刷卡记录

- **URL**: `POST /payCardLog/page`
- **请求体**: `PayCardLogPageDTO`

```json
{
  "page": 1,
  "size": 10,
  "cardNo": "12345678",
  "name": "张三"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | Integer | 是 | 页码 |
| size | Integer | 是 | 每页大小 |
| cardNo | String | 否 | 卡号 |
| name | String | 否 | 姓名 |

- **响应**: `Result<IPage<PayCardLogPageVO>>`

**PayCardLogPageVO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Integer | 记录ID |
| cardNo | String | 卡号 |
| jobNumber | String | 工号 |
| name | String | 姓名 |
| college | String | 学院 |
| result | Integer | 结果 |
| roomName | String | 教室名称 |
| actionTime | String | 刷卡时间 |

---

### 11. 报表统计 `/report`

#### 11.1 刷卡最多及最少教室

- **URL**: `POST /report/room/page`
- **请求体**: `ReportPageDTO`

```json
{
  "sort": 2,
  "year": 2026,
  "month": 3,
  "season": "spring",
  "page": 1,
  "pageSize": 10,
  "startTime": "2026-01-01",
  "endTime": "2026-03-31"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| sort | Integer | 否 | 排序 |
| year | Integer | 否 | 年份 |
| month | Integer | 否 | 月份 |
| season | String | 否 | 季节 |
| page | Integer | 是 | 页码 |
| pageSize | Integer | 是 | 每页大小 |
| startTime | Date | 否 | 开始时间 |
| endTime | Date | 否 | 结束时间 |

- **响应**: `Result<IPage<ReportRoomVO>>`

**ReportRoomVO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| roomCode | String | 教室编号 |
| payCount | Integer | 刷卡次数 |

#### 11.2 刷卡最多及最少个人

- **URL**: `POST /report/personal/page`
- **请求体**: `ReportPageDTO`（同上）
- **响应**: `Result<IPage<ReportPersonalVO>>`

**ReportPersonalVO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| name | String | 姓名 |
| cardNo | String | 卡号 |
| college | String | 学院 |
| payCount | Integer | 刷卡次数 |

#### 11.3 学院刷卡排名

- **URL**: `POST /report/college/page`
- **请求体**: `ReportPageDTO`（同上）
- **响应**: `Result<IPage<ReportCollegeVO>>`

**ReportCollegeVO 响应字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| college | String | 学院名称 |
| payCount | Integer | 刷卡次数 |

---

## 三、空控制器（无接口）

以下控制器目前没有暴露接口方法：

| 控制器 | 路径 | 说明 |
|--------|------|------|
| StreamOutputController | `/streamOutputDO` | 转码输出流（暂无接口） |
| DeviceController | `/deviceDO` | 设备控制器（暂无接口） |
| WorkOrderLogController | `/workOrderLogDO` | 保修日志控制器（暂无接口） |
