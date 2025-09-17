document.addEventListener("DOMContentLoaded", function () {
    getBrands();
});

document.addEventListener("DOMContentLoaded", function () {
    getBrands();

    document.getElementById("addBrandForm").addEventListener("submit", function (e) {
        e.preventDefault();
        addBrand();
    });

    document.getElementById("editBrandForm").addEventListener("submit", function (e) {
        e.preventDefault();
        updateBrand();
    });
});

function getBrands() {
    fetch("http://127.0.0.1:8000/api/brands")
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById("table-body");
            tbody.innerHTML = "";

            data.forEach(brand => {
                const tr = document.createElement("tr");

                tr.innerHTML = `
                    <td>${brand.brand_name ?? ''}</td>
                    <td>
                        ${brand.brand_image_url 
                            ? `<img src="${brand.brand_image_url}" alt="Brand" width="50">` 
                            : 'No image'}
                    </td>
                    <td>${brand.description ?? ''}</td>
                    <td>${brand.bonus_message ?? ''}</td>
                    <td>${brand.tag ?? ''}</td>
                    <td>${brand.isNew ? "Yes" : "No"}</td>
                    <td>${brand.rating ?? 0}</td>
                    <td>
                        <button class="btn btn-sm btn-info p-2" onclick="viewBrand(${brand.brand_id})">View</button>
                        <button class="btn btn-sm btn-warning p-2" onclick="editBrand(${brand.brand_id})">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteBrand(${brand.brand_id})">Delete</button>
                    </td>
                `;

                tbody.appendChild(tr);
            });
        })
        .catch(error => console.error("Error fetching brands:", error));
}

function viewBrand(id) {
    fetch(`http://127.0.0.1:8000/api/brands/${id}`)
        .then(res => res.json())
        .then(brand => {
            document.getElementById("viewBrandContent").innerHTML = `
                <p><strong>Name:</strong> ${brand.brand_name}</p>
                <p><strong>Description:</strong> ${brand.description}</p>
                <p><strong>Bonus:</strong> ${brand.bonus_message}</p>
                <p><strong>Tag:</strong> ${brand.tag}</p>
                <p><strong>Is New:</strong> ${brand.isNew ? "Yes" : "No"}</p>
                <p><strong>Rating:</strong> ${brand.rating}</p>
                ${brand.brand_image_url ? `<img src="${brand.brand_image_url}" class="img-fluid">` : ""}
            `;
            new bootstrap.Modal(document.getElementById("viewBrandModal")).show();
        });
}

function editBrand(id) {
    fetch(`http://127.0.0.1:8000/api/brands/${id}`)
        .then(res => res.json())
        .then(brand => {
            document.getElementById("editBrandId").value = brand.brand_id;
            document.getElementById("editBrandName").value = brand.brand_name;
            document.getElementById("editBrandDescription").value = brand.description;
            document.getElementById("editBrandBonus").value = brand.bonus_message;
            document.getElementById("editBrandTag").value = brand.tag;
            document.getElementById("editBrandIsNew").value = brand.isNew ? 1 : 0;
            document.getElementById("editBrandRating").value = brand.rating;
            new bootstrap.Modal(document.getElementById("editBrandModal")).show();
        });
}

// function updateBrand() {
//     const id = document.getElementById("editBrandId").value;
//     const body = {
//         brand_name: document.getElementById("editBrandName").value,
//         description: document.getElementById("editBrandDescription").value,
//         bonus_message: document.getElementById("editBrandBonus").value,
//         tag: document.getElementById("editBrandTag").value,
//         isNew: document.getElementById("editBrandIsNew").value,
//         rating: document.getElementById("editBrandRating").value,
//     };

//     fetch(`http://127.0.0.1:8000/api/brands/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json", "Accept": "application/json" },
//         body: JSON.stringify(body),
//     })
//     .then(res => res.json())
//     .then(() => {
//         getBrands();
//         bootstrap.Modal.getInstance(document.getElementById("editBrandModal")).hide();
//     });
// }

document.getElementById("addBrandForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    try {
        const response = await fetch("http://127.0.0.1:8000/api/brands", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Error adding brand");
        }

        const data = await response.json();

        const modal = bootstrap.Modal.getInstance(document.getElementById("addBrandModal"));
        modal.hide();

        form.reset();

        getBrands();

    } catch (error) {
        console.error(error);
        alert("Unable to add the brand!");
    }
});

document.getElementById("editBrandForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const id = document.getElementById("editBrandId").value;
    const form = e.target;
    const formData = new FormData(form);

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/brands/${id}`, {
            method: "POST", 
            headers: { "X-HTTP-Method-Override": "PUT" },
            body: formData
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la mise à jour du brand");
        }

        const data = await response.json();

        const modal = bootstrap.Modal.getInstance(document.getElementById("editBrandModal"));
        modal.hide();

        getBrands();

    } catch (error) {
        console.error(error);
        alert("Impossible de mettre à jour le brand !");
    }
});

function deleteBrand(id) {
    if (!confirm("Are you sure you want to delete this brand?")) return;

    fetch(`http://127.0.0.1:8000/api/brands/${id}`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
    })
    .then(response => {
        if (response.ok) {
            alert("Brand deleted successfully!");
            getBrands();
        } else {
            alert("Failed to delete brand.");
        }
    })
    .catch(error => console.error("Error deleting brand:", error));
}
