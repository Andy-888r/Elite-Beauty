package com.organice.repository;

import com.organice.model.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BannerRepository extends JpaRepository<Banner, Integer> {
    List<Banner> findByActivoTrueOrderByOrdenAsc();
}
