using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly DataBaseContext _dataBaseContext;

        public CategoryRepository(DataBaseContext dataBaseContext)
        {
            _dataBaseContext = dataBaseContext;
        }

        public List<Category> GetAllCategories()
        {
            // Traemos todo
            var categories = _dataBaseContext.Categories
                .Include(c => c.SubCategories)
                .Include(c => c.Productos)
                    .ThenInclude(p => p.Sizes)
                .ToList();

            // Diccionario para acceder rápido por Id
            var categoryDict = categories.ToDictionary(c => c.Id, c => c);

            // Lista final de categorías raíz
            var rootCategories = new List<Category>();

            foreach (var cat in categories)
            {
                if (cat.ParentCategoryId.HasValue)
                {
                    // Si tiene padre, agregamos como subcategoría
                    if (categoryDict.TryGetValue(cat.ParentCategoryId.Value, out var parent))
                    {
                        if (parent.SubCategories == null)
                            parent.SubCategories = new List<Category>();
                        parent.SubCategories.Add(cat);
                    }
                }
                else
                {
                    // Si no tiene padre, es raíz
                    rootCategories.Add(cat);
                }
            }

            return rootCategories;
        }

        // Trae una categoría por Id con productos y talles
        public Category? GetCategoryById(int id)
        {
            var category = _dataBaseContext.Categories
                .Include(c => c.SubCategories)
                .Include(c => c.Productos)
                    .ThenInclude(p => p.Sizes)
                .Include(c => c.Productos)
                    .ThenInclude(p => p.Categories)
                .FirstOrDefault(c => c.Id == id);

            if (category == null)
                return null;

            void LoadSubCategoryProducts(Category cat)
            {
                foreach (var sub in cat.SubCategories)
                {
                    sub.Productos = _dataBaseContext.Products
                        .Include(p => p.Sizes)
                        .Include(p => p.Categories)
                        .Where(p => p.Categories.Any(c => c.Id == sub.Id))
                        .ToList();

                    if (sub.SubCategories != null && sub.SubCategories.Any())
                        LoadSubCategoryProducts(sub);
                }
            }

            if (category.SubCategories != null && category.SubCategories.Any())
                LoadSubCategoryProducts(category);

            return category;
        }

        public List<int> GetAllSubCategoryIds(int categoryId)
        {
            var result = new List<int> { categoryId };

            var childrenIds = _dataBaseContext.Categories
                .Where(c => c.ParentCategoryId == categoryId)
                .Select(c => c.Id)
                .ToList();

            foreach (var childId in childrenIds)
            {
                result.AddRange(GetAllSubCategoryIds(childId));
            }

            return result;
        }
        public List<Category> GetCategoriesByIds(List<int> ids) // ← agregado
        {
            return _dataBaseContext.Categories
                .Where(c => ids.Contains(c.Id))
                .ToList();
        }

        // Agrega una nueva categoría
        public void AddCategory(Category category)
        {
            _dataBaseContext.Categories.Add(category);
            _dataBaseContext.SaveChanges();
        }

        // Actualiza una categoría
        public void UpdateCategory(Category category)
        {
            _dataBaseContext.Categories.Update(category);
            _dataBaseContext.SaveChanges();
        }

        public void SoftDeleteCategory(Category category)
        {
            category.Habilitado = !category.Habilitado;
            _dataBaseContext.SaveChanges();
        }

        // Elimina físicamente una categoría
        public void HardDeleteCategory(Category category)
        {
            _dataBaseContext.Categories.Remove(category);
            _dataBaseContext.SaveChanges();
        }
    }
}
