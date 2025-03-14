import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useBookmarkStore = defineStore('bookmark', () => {
  const bookmarkedTalents = ref([]);

  const toggleBookmark = (talent) => {
    const index = bookmarkedTalents.value.findIndex(t => t.id === talent.id);
    
    if (index === -1) {
      // 북마크 추가
      bookmarkedTalents.value.push({
        id: talent.id,
        name: talent.basicInfo.name,
        nationality: talent.nationalityInfo,
        career: talent.basicInfo.totalCareer,
        education: talent.educations[0].schoolName,
        major: talent.educations[0].major,
        bookmarkedDate: new Date().toISOString().split('T')[0]
      });
    } else {
      // 북마크 제거
      bookmarkedTalents.value.splice(index, 1);
    }
  };

  const isBookmarked = (talentId) => {
    return bookmarkedTalents.value.some(t => t.id === talentId);
  };

  return {
    bookmarkedTalents,
    toggleBookmark,
    isBookmarked
  };
}); 