<script setup>
import { ref, watch } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Dropdown from 'primevue/dropdown';
import Toast from 'primevue/toast';
import InputSwitch from 'primevue/inputswitch';

const props = defineProps({
    isOpen: Boolean,
    user: Object
});

const emit = defineEmits(['close', 'update', 'delete']);

const isEditMode = ref(false);
const editedUser = ref({});

// 성별 옵션 단순화
const genderOptions = [
    { label: '남', value: '남' },
    { label: '여', value: '여' }
];

// 권한 옵션 단순화
const roleOptions = [
    { label: 'USER', value: 'USER' },
    { label: 'MANAGER', value: 'MANAGER' },
    { label: 'ADMIN', value: 'ADMIN' }
];

// 프로필 이미지 관련 상태 추가
const profileImage = ref(null);
const imagePreview = ref(null);

// 파일 선택 처리
const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
        // 파일 미리보기 생성
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.value = e.target.result;
            // 실제로는 여기서 이미지를 서버에 업로드하고 URL을 받아와야 함
        };
        reader.readAsDataURL(file);

        // 모의 업로드 성공 메시지
        setTimeout(() => {
            toast.add({
                severity: 'success',
                summary: '업로드 완료',
                detail: '프로필 이미지가 업데이트되었습니다.',
                life: 3000
            });
        }, 500);
    }
};

// 이미지 제거
const removeImage = () => {
    imagePreview.value = null;
    profileImage.value = null;
};

// 사용자 정보가 변경될 때마다 편집용 객체 초기화
watch(() => props.user, (newUser) => {
    if (newUser) {
        editedUser.value = { ...newUser };
        imagePreview.value = newUser.profileImage || null;
    }
}, { immediate: true });

// 모달이 닫힐 때 편집 모드 초기화
watch(() => props.isOpen, (newValue) => {
    if (!newValue) {
        isEditMode.value = false;
    }
});

const toggleEditMode = () => {
    isEditMode.value = !isEditMode.value;  // 상태를 반전시킴
    
    if (!isEditMode.value) {  // 편집 모드가 끝날 때
        emit('update', editedUser.value);
    }
};

const cancelEdit = () => {
    isEditMode.value = false;
    editedUser.value = { ...props.user };
};

const closeModal = () => {
    isEditMode.value = false;
    emit('close');
};

const handleDelete = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
        emit('delete', props.user.id);
    }
};

// 권한 레이블 변환 함수 추가
const getRoleLabel = (value) => {
    const option = roleOptions.find(opt => opt.value === value);
    return option ? option.label : value;
};
</script>

<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="modal-content">
            <div class="modal-header">
                <h2>사용자 정보</h2>
                <Button 
                    icon="pi pi-times" 
                    class="p-button-text p-button-rounded" 
                    @click="closeModal"
                />
            </div>
            <div class="modal-body">
                <div class="user-info">
                    <table class="info-table">
                        <tbody>
                            <tr>
                                <th colspan="2" class="section-header">프로필 이미지</th>
                            </tr>
                            <tr>
                                <td colspan="2" class="profile-cell">
                                    <div class="profile-image-container">
                                        <img 
                                            v-if="imagePreview" 
                                            :src="imagePreview" 
                                            class="profile-image"
                                            alt="프로필 이미지"
                                        />
                                        <div v-else class="profile-placeholder">
                                            <i class="pi pi-user"></i>
                                        </div>
                                        
                                        <div v-if="isEditMode" class="image-actions">
                                            <label class="upload-button">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    @change="handleFileSelect"
                                                    class="hidden"
                                                />
                                                <span>이미지 {{ imagePreview ? '변경' : '업로드' }}</span>
                                            </label>
                                            <Button
                                                v-if="imagePreview"
                                                icon="pi pi-trash"
                                                class="p-button-danger p-button-text"
                                                @click="removeImage"
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>로그인 ID</th>
                                <td>{{ user?.loginId }}</td>
                            </tr>
                            <tr>
                                <th>이름</th>
                                <td>
                                    <template v-if="isEditMode">
                                        <InputText v-model="editedUser.name" class="w-full" />
                                    </template>
                                    <template v-else>{{ user?.name }}</template>
                                </td>
                            </tr>
                            <tr>
                                <th>생년월일</th>
                                <td>
                                    <template v-if="isEditMode">
                                        <InputText v-model="editedUser.birthDate" class="w-full" />
                                    </template>
                                    <template v-else>{{ user?.birthDate || '001212' }}</template>
                                </td>
                            </tr>
                            <tr>
                                <th>모바일</th>
                                <td>
                                    <template v-if="isEditMode">
                                        <InputText v-model="editedUser.mobile" class="w-full" />
                                    </template>
                                    <template v-else>{{ user?.mobile }}</template>
                                </td>
                            </tr>
                            <tr>
                                <th>이메일</th>
                                <td>
                                    <template v-if="isEditMode">
                                        <InputText v-model="editedUser.email" class="w-full" />
                                    </template>
                                    <template v-else>{{ user?.email }}</template>
                                </td>
                            </tr>
                            <tr>
                                <th>권한</th>
                                <td>
                                    <template v-if="isEditMode">
                                        <Dropdown
                                            v-model="editedUser.role"
                                            :options="roleOptions"
                                            optionLabel="label"
                                            optionValue="value"
                                            placeholder="권한 선택"
                                            class="w-full"
                                        />
                                    </template>
                                    <template v-else>{{ getRoleLabel(user?.role) || '-' }}</template>
                                </td>
                            </tr>
                            <tr>
                                <th>성별</th>
                                <td>
                                    <template v-if="isEditMode">
                                        <Dropdown
                                            v-model="editedUser.gender"
                                            :options="genderOptions"
                                            optionLabel="label"
                                            optionValue="value"
                                            placeholder="성별 선택"
                                            class="w-full"
                                        />
                                    </template>
                                    <template v-else>{{ user?.gender }}</template>
                                </td>
                            </tr>
                            <tr>
                                <th>고용주 여부</th>
                                <td>
                                    <template v-if="isEditMode">
                                        <InputSwitch
                                            v-model="editedUser.employer"
                                            class="custom-switch"
                                        />
                                    </template>
                                    <template v-else>
                                        {{ user?.employer ? '예' : '아니오' }}
                                    </template>
                                </td>
                            </tr>
                            <tr>
                                <th>활성여부</th>
                                <td>
                                    <template v-if="isEditMode">
                                        <InputSwitch
                                            v-model="editedUser.active"
                                            class="custom-switch"
                                        />
                                    </template>
                                    <template v-else>
                                        {{ user?.active ? '활성' : '비활성' }}
                                    </template>
                                </td>
                            </tr>
                            <tr>
                                <th>최근 로그인</th>
                                <td>{{ user?.lastLoginAt || '-' }}</td>
                            </tr>
                            <tr>
                                <th>생성일시</th>
                                <td>{{ user?.createdAt }}</td>
                            </tr>
                            <tr>
                                <th>수정일시</th>
                                <td>{{ user?.updatedAt || '-' }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="modal-footer">
                <template v-if="isEditMode">
                    <Button 
                        label="취소" 
                        class="p-button-text" 
                        @click="() => {
                            console.log('취소 버튼 클릭');
                            cancelEdit();
                        }" 
                    />
                    <Button 
                        label="저장" 
                        class="p-button-primary" 
                        @click="() => {
                            console.log('저장 버튼 클릭');
                            toggleEditMode();
                        }" 
                    />
                </template>
                <template v-else>
                    <Button 
                        label="닫기" 
                        class="p-button-text" 
                        @click="() => {
                            console.log('닫기 버튼 클릭');
                            closeModal();
                        }" 
                    />
                    <Button 
                        label="편집" 
                        class="p-button-primary" 
                        @click="() => {
                            toggleEditMode();
                        }" 
                    />
                    <Button 
                        label="삭제" 
                        class="p-button-danger" 
                        @click="() => {
                            handleDelete();
                        }" 
                    />
                </template>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    z-index: 1100;
}

.modal-content {
    background-color: white;
    border-radius: 8px;
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
}

.modal-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-body {
    padding: 1.5rem;
    overflow-y: auto;
    flex: 1;
}

.modal-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    background-color: white;

    :deep(.p-button) {
        &.p-button-text {
            color: #6b7280;
            
            &:hover {
                background-color: #f3f4f6;
            }
        }

        &.p-button-primary {
            background-color: #8B8BF5;
            border-color: #8B8BF5;
            
            &:hover {
                background-color: darken(#8B8BF5, 5%);
                border-color: darken(#8B8BF5, 5%);
            }
        }

        &.p-button-danger {
            &:hover {
                background-color: darken(#dc2626, 5%);
                border-color: darken(#dc2626, 5%);
            }
        }
    }
}

.info-table {
    width: 100%;
    border-collapse: collapse;

    th, td {
        padding: 0.75rem;
        border-bottom: 1px solid #e5e7eb;
    }

    th {
        width: 120px;
        background-color: #f8f9fa;
        font-weight: 500;
    }

    td {
        :deep(.p-inputtext),
        :deep(.p-dropdown) {
            width: 100%;
            height: 2.5rem;
        }

        :deep(.p-dropdown) {
            width: 100%;
            min-height: 2.5rem;

            .p-dropdown-label {
                padding: 0.5rem;
            }

            .p-dropdown-panel {
                z-index: 1200;
            }

            &.p-dropdown-clearable .p-dropdown-label {
                padding-right: 2rem;
            }

            .p-dropdown-trigger {
                width: 2.5rem;
            }
        }

        :deep(.p-dropdown-panel) {
            background: #ffffff;
            border: 1px solid #ced4da;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        :deep(.p-dropdown-items) {
            padding: 0.5rem 0;
        }

        :deep(.p-dropdown-item) {
            padding: 0.5rem 1rem;
            margin: 0;
            cursor: pointer;

            &:hover {
                background-color: #f3f4f6;
            }
        }

        :deep(.p-select) {
            width: 100%;
            
            .p-select-label {
                padding: 0.5rem;
            }
        }

        :deep(.custom-switch) {
            .p-inputswitch-slider {
                background-color: #e5e7eb;
            }

            &.p-inputswitch-checked {
                .p-inputswitch-slider {
                    background-color: #8B8BF5;
                }
            }
        }
    }

    .section-header {
        background-color: #f3f4f6;
        font-weight: 600;
    }

    .profile-cell {
        padding: 1.5rem;
        text-align: center;
        background-color: #f8f9fa;

        .profile-image-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;

            .profile-image {
                width: 120px;  // 증명사진 비율 (3:4)
                height: 160px;
                border-radius: 0;  // 둥근 모서리 제거
                object-fit: cover;
                border: 1px solid #e5e7eb;  // 테두리 스타일 변경
                background-color: white;
            }

            .profile-placeholder {
                width: 120px;
                height: 160px;
                border-radius: 0;  // 둥근 모서리 제거
                background-color: #f3f4f6;
                border: 1px solid #e5e7eb;
                display: flex;
                align-items: center;
                justify-content: center;
                
                i {
                    font-size: 3rem;
                    color: #9ca3af;
                }
            }

            .image-actions {
                display: flex;
                gap: 0.5rem;
                align-items: center;
                margin-top: 0.5rem;

                .upload-button {
                    background-color: #8B8BF5;
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.875rem;
                    transition: background-color 0.2s;

                    &:hover {
                        background-color: darken(#8B8BF5, 5%);
                    }

                    input[type="file"] {
                        display: none;
                    }
                }
            }
        }
    }
}

:deep(.p-dropdown-panel) {
    z-index: 1200 !important;
}

:deep(.p-select-panel) {
    z-index: 1200 !important;
}
</style> 