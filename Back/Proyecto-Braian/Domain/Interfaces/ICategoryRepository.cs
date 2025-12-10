using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface ICategoryRepository
    {
        List<Category> GetAllCategories();
        List<int> GetAllSubCategoryIds(int categoryId);
        Category? GetCategoryById(int id);
        List<Category> GetCategoriesByIds(List<int> ids);
        void AddCategory(Category category);
        void UpdateCategory(Category category);
        void SoftDeleteCategory(Category category);
        void HardDeleteCategory(Category category);
    }
}
